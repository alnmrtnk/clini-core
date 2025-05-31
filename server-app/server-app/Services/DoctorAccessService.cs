using AutoMapper;
using server_app.Dtos;
using server_app.Helpers;
using server_app.Models;
using server_app.Repositories;
using System.Text.RegularExpressions;

namespace server_app.Services
{
    public interface IDoctorAccessService
    {
        Task<ServiceResult<DoctorAccessDto>> CreateAsync(CreateDoctorAccessDto dto);
        Task<ServiceResult<bool>> ValidateAsync(Guid? userId, string? token);
        Task<ServiceResult<IEnumerable<MedicalRecordGroupDto>>> GetAccessibleRecordsAsync(Guid? userId, string? token);
        Task<ServiceResult<IEnumerable<DoctorAccessDto>>> GetGrantedAccessesAsync();
        Task<ServiceResult<bool>> RevokeAsync(Guid id);
    }

    public class DoctorAccessService : IDoctorAccessService
    {
        private readonly IDoctorAccessRepository _repo;
        private readonly IUserRepository _users;
        private readonly IMedicalRecordService _records;
        private readonly IMapper _map;

        public DoctorAccessService(IDoctorAccessRepository repo, IUserRepository users, IMedicalRecordService records, IMapper mapper)
        {
            _repo = repo;
            _users = users;
            _records = records;
            _map = mapper;
        }

        public async Task<ServiceResult<DoctorAccessDto>> CreateAsync(CreateDoctorAccessDto dto)
        {
            var access = new DoctorAccess
            {
                Name = dto.Name,
                OwnerUserId = new Guid(),
                ExpiresAt = dto.ExpiresAt,
            };

            if (!string.IsNullOrWhiteSpace(dto.TargetUserEmail))
            {
                var targetUser = await _users.GetEntityByEmailAsync(dto.TargetUserEmail);
                if (targetUser == null)
                    return ServiceResult<DoctorAccessDto>
                              .Fail("User not found", StatusCodes.Status404NotFound);

                var existingAccesses = await _repo.GetByTargetUserIdAsync(targetUser.Id);

                if (existingAccesses != null && existingAccesses.Any())
                {
                    foreach (var oldAccess in existingAccesses)
                    {
                        await _repo.RevokeAsync(oldAccess.Id);
                    }
                }

                access.TargetUserId = targetUser.Id;
                access.TargetUserEmail = targetUser.Email;
            }
            else
            {
                access.Token = Guid.NewGuid().ToString("N");
            }

            await _repo.AddAsync(access);

            return ServiceResult<DoctorAccessDto>.Ok(new DoctorAccessDto
            {
                Id = access.Id,
                Name = access.Name,
                Token = access.Token,
                ExpiresAt = access.ExpiresAt,
                Revoked = access.Revoked,
                TargetUserEmail = access.TargetUserEmail
            });
        }

        public async Task<ServiceResult<bool>> ValidateAsync(Guid? userId, string? token)
        {
            var entries = userId.HasValue
                ? await _repo.GetValidAccessesForUserAsync(userId.Value)
                : await _repo.GetValidAccessesByTokenAsync(token!);

            var valid = entries.Any(e => !e.Revoked && e.ExpiresAt > DateTime.UtcNow);
            return ServiceResult<bool>.Ok(valid);
        }

        public async Task<ServiceResult<IEnumerable<MedicalRecordGroupDto>>> GetAccessibleRecordsAsync(Guid? userId, string? token)
        {
            var entries = userId.HasValue
                 ? await _repo.GetValidAccessesForUserAsync(userId.Value)
                 : await _repo.GetValidAccessesByTokenAsync(token!);

            var ownerIds = entries
                .Where(e => !e.Revoked && e.ExpiresAt > DateTime.UtcNow)
                .Select(e => e.OwnerUserId)
                .Distinct()
                .ToList();

            if (!ownerIds.Any())
                return ServiceResult<IEnumerable<MedicalRecordGroupDto>>.Ok(Array.Empty<MedicalRecordGroupDto>());

            var dbRecs = await _records.GetByUserIdsAsync(ownerIds);

            var groups = dbRecs
                .GroupBy(r => r.UserId)
                .Select(g =>
                {
                    var representative = g.First().User;
                    var group = new MedicalRecordGroupDto
                    {
                        OwnerUserId = representative.Id,
                        OwnerName = representative.FullName,
                        OwnerEmail = representative.Email,
                        Records = _map.Map<List<MedicalRecordDto>>(g.ToList())
                    };

                    group.Records.ForEach((record) =>
                    {
                        record.DoctorComments = record.DoctorComments.Where(dc => dc.IsPublic || entries.Any(da => da.Id == dc.DoctorAccessId)).ToList();
                        foreach (var item in record.DoctorComments)
                        {
                            item.DoctorName = entries.Any(e => e.Id == item.DoctorAccessId) ? "You" : item.DoctorName;
                        }
                    });
                    return group;
                })
                .ToList();

            return ServiceResult<IEnumerable<MedicalRecordGroupDto>>.Ok(groups);
        }

        public async Task<ServiceResult<IEnumerable<DoctorAccessDto>>> GetGrantedAccessesAsync()
        {
            var accesses = await _repo.GetGrantedAccessesByCurrentUserAsync();

            var result = accesses.Select(a => new DoctorAccessDto
            {
                Id = a.Id,
                Name = a.Name,
                Token = a.Token,
                ExpiresAt = a.ExpiresAt,
                Revoked = a.Revoked,
                TargetUserEmail = a.TargetUserEmail
            });

            return ServiceResult<IEnumerable<DoctorAccessDto>>.Ok(result);
        }

        public async Task<ServiceResult<bool>> RevokeAsync(Guid id)
        {
            var success = await _repo.RevokeAsync(id);

            return success
                ? ServiceResult<bool>.Ok(true)
                : ServiceResult<bool>.Fail("Access not found or already revoked", StatusCodes.Status404NotFound);
        }
    }
}