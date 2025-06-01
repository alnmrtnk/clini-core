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
        private readonly IDoctorAccessRepository _doctorAccessRepo;
        private readonly IUserRepository _usersRepo;
        private readonly IMedicalRecordService _medicalRecordsService;
        private readonly IEsculabRepository _ecsculabRepository;
        private readonly IMapper _map;

        public DoctorAccessService(
            IDoctorAccessRepository doctorAccessRepo, 
            IUserRepository users, 
            IMedicalRecordService records, 
            IEsculabRepository ecsculabRepository,
            IMapper mapper
            )
        {
            _doctorAccessRepo = doctorAccessRepo;
            _usersRepo = users;
            _medicalRecordsService = records;
            _map = mapper;
            _ecsculabRepository = ecsculabRepository;
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
                var targetUser = await _usersRepo.GetEntityByEmailAsync(dto.TargetUserEmail);
                if (targetUser == null)
                    return ServiceResult<DoctorAccessDto>
                              .Fail("User not found", StatusCodes.Status404NotFound);

                var existingAccesses = await _doctorAccessRepo.GetByTargetUserIdAsync(targetUser.Id);

                if (existingAccesses != null && existingAccesses.Any())
                {
                    foreach (var oldAccess in existingAccesses)
                    {
                        await _doctorAccessRepo.RevokeAsync(oldAccess.Id);
                    }
                }

                access.TargetUserId = targetUser.Id;
                access.TargetUserEmail = targetUser.Email;
            }
            else
            {
                access.Token = Guid.NewGuid().ToString("N");
            }

            await _doctorAccessRepo.AddAsync(access);

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
                ? await _doctorAccessRepo.GetValidAccessesForUserAsync(userId.Value)
                : await _doctorAccessRepo.GetValidAccessesByTokenAsync(token!);

            var valid = entries.Any(e => !e.Revoked && e.ExpiresAt > DateTime.UtcNow);
            return ServiceResult<bool>.Ok(valid);
        }

        public async Task<ServiceResult<IEnumerable<MedicalRecordGroupDto>>> GetAccessibleRecordsAsync(Guid? userId, string? token)
        {
            var entries = userId.HasValue
                 ? await _doctorAccessRepo.GetValidAccessesForUserAsync(userId.Value)
                 : await _doctorAccessRepo.GetValidAccessesByTokenAsync(token!);

            var ownerIds = entries
                .Where(e => !e.Revoked && e.ExpiresAt > DateTime.UtcNow)
                .Select(e => e.OwnerUserId)
                .Distinct()
                .ToList();

            if (!ownerIds.Any() || ownerIds == null)
                return ServiceResult<IEnumerable<MedicalRecordGroupDto>>.Ok(Array.Empty<MedicalRecordGroupDto>());

            var medicalDtos = await _medicalRecordsService.GetByUserIdsAsync(ownerIds);

            var medGroups = medicalDtos
                .GroupBy(r => r.UserId)
                .Select(g => new {
                    UserId = g.Key,
                    Records = g.ToList()
                })
                .ToDictionary(x => x.UserId, x => x.Records);

            var esculabDtos = await _ecsculabRepository.GetByUserIdsAsync(ownerIds);
            var esculabGroups = esculabDtos
                .GroupBy(r => r.UserId)
                .Select(g => new
                {
                    UserId = g.Key,
                    Records = g.ToList()
                })
                .ToDictionary(x => x.UserId, x => x.Records);

            var groups = new List<MedicalRecordGroupDto>();

            foreach (var ownerId in ownerIds)
            {
                var anyMed = medicalDtos.FirstOrDefault(r => r.UserId == ownerId);
                string ownerName = anyMed?.User.FullName ?? "Unknown";
                string ownerEmail = anyMed?.User.Email ?? "Unknown";

                var groupDto = new MedicalRecordGroupDto
                {
                    OwnerUserId = ownerId,
                    OwnerName = ownerName,
                    OwnerEmail = ownerEmail,
                    Records = medGroups.TryGetValue(ownerId, out var listMed)
                                 ? listMed
                                 : new List<MedicalRecordDto>(),
                    EsculabRecords = esculabGroups.TryGetValue(ownerId, out var listEsc)
                                 ? listEsc
                                 : new List<EsculabRecord>()
                };

                groupDto.Records.ForEach(record =>
                {
                    record.DoctorComments = record.DoctorComments
                        .Where(dc =>
                            dc.IsPublic
                            || entries.Any(da => da.Id == dc.DoctorAccessId)
                        )
                        .ToList();

                    record.DoctorComments.ToList().ForEach(dc =>
                    {
                        dc.DoctorAccess.Name = entries.Any(e => e.Id == dc.DoctorAccessId)
                                          ? "You"
                                          : (dc.DoctorAccess.TargetUserEmail ?? dc.DoctorAccess.Name);
                    });
                });

                groupDto.EsculabRecords.ForEach(er =>
                {
                    er.EsculabRecordDetails = er.EsculabRecordDetails;
                    er.DoctorComments = er.DoctorComments
                       .Where(dc =>
                           dc.IsPublic
                           || entries.Any(da => da.Id == dc.DoctorAccessId)
                       )
                       .ToList();

                    er.DoctorComments.ToList().ForEach(dc =>
                    {
                        dc.DoctorAccess.Name = entries.Any(e => e.Id == dc.DoctorAccessId)
                                          ? "You"
                                          : (dc.DoctorAccess.TargetUserEmail ?? dc.DoctorAccess.Name);
                    });
                });

                groups.Add(groupDto);
            }

            return ServiceResult<IEnumerable<MedicalRecordGroupDto>>.Ok(groups);
        }

        public async Task<ServiceResult<IEnumerable<DoctorAccessDto>>> GetGrantedAccessesAsync()
        {
            var accesses = await _doctorAccessRepo.GetGrantedAccessesByCurrentUserAsync();

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
            var success = await _doctorAccessRepo.RevokeAsync(id);

            return success
                ? ServiceResult<bool>.Ok(true)
                : ServiceResult<bool>.Fail("Access not found or already revoked", StatusCodes.Status404NotFound);
        }
    }
}