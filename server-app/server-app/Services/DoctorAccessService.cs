using server_app.Dtos;
using server_app.Helpers;
using server_app.Models;
using server_app.Repositories;

namespace server_app.Services
{
    public interface IDoctorAccessService
    {
        Task<ServiceResult<DoctorAccessDto>> CreateAsync(CreateDoctorAccessDto dto);
        Task<ServiceResult<bool>> ValidateAsync(Guid? userId, string? token);
        Task<ServiceResult<IEnumerable<MedicalRecordDto>>> GetAccessibleRecordsAsync(Guid? userId, string? token);
        Task<ServiceResult<IEnumerable<DoctorAccessDto>>> GetGrantedAccessesAsync();
        Task<ServiceResult<bool>> RevokeAsync(Guid id);
    }

    public class DoctorAccessService : IDoctorAccessService
    {
        private readonly IDoctorAccessRepository _repo;
        private readonly IUserRepository _users;
        private readonly IMedicalRecordRepository _records;

        public DoctorAccessService(IDoctorAccessRepository repo, IUserRepository users, IMedicalRecordRepository records)
        {
            _repo = repo;
            _users = users;
            _records = records;
        }

        public async Task<ServiceResult<DoctorAccessDto>> CreateAsync(CreateDoctorAccessDto dto)
        {
            var access = new DoctorAccess
            {
                Name = dto.Name,
                OwnerUserId = new Guid(),
                ExpiresAt = dto.ExpiresAt,
            };

            if (!string.IsNullOrWhiteSpace(dto.TargetEmail))
            {
                var targetUser = await _users.GetEntityByEmailAsync(dto.TargetEmail);
                if (targetUser == null)
                    return ServiceResult<DoctorAccessDto>.Fail("User not found", StatusCodes.Status404NotFound);

                access.TargetUserId = targetUser.Id;
            }
            else
            {
                access.Token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
            }

            await _repo.AddAsync(access);

            return ServiceResult<DoctorAccessDto>.Ok(new DoctorAccessDto
            {
                Id = access.Id,
                Name = access.Name,
                Token = access.Token,
                ExpiresAt = access.ExpiresAt,
                Revoked = access.Revoked
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

        public async Task<ServiceResult<IEnumerable<MedicalRecordDto>>> GetAccessibleRecordsAsync(Guid? userId, string? token)
        {
            var entries = userId.HasValue
                ? await _repo.GetValidAccessesForUserAsync(userId.Value)
                : await _repo.GetValidAccessesByTokenAsync(token!);

            var ownerIds = entries
                .Where(e => !e.Revoked && e.ExpiresAt > DateTime.UtcNow)
                .Select(e => e.OwnerUserId)
                .Distinct();

            var result = new List<MedicalRecordDto>();

            foreach (var ownerId in ownerIds)
            {
                var records = await _records.GetByUserIdAsync(ownerId);
                result.AddRange(records);
            }

            return ServiceResult<IEnumerable<MedicalRecordDto>>.Ok(result);
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
                Revoked = a.Revoked
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