using AutoMapper;
using server_app.Dtos;
using server_app.Helpers;
using server_app.Models;
using server_app.Repositories;

namespace server_app.Services
{
    public interface IDoctorCommentService
    {
        Task<ServiceResult<DoctorCommentDto>> CreateAsync(CreateDoctorCommentDto dto);
        Task<ServiceResult<IEnumerable<DoctorCommentDto>>> GetByMedicalRecordAsync(Guid medicalRecordId);
        Task<ServiceResult<IEnumerable<DoctorCommentTypeDto>>> GetCommentTypesAsync();
        Task<ServiceResult<bool>> UpdateAsync(Guid id, CreateDoctorCommentDto dto);
        Task<ServiceResult<bool>> DeleteAsync(Guid id);
    }

    public class DoctorCommentService : IDoctorCommentService
    {
        private readonly IDoctorCommentRepository _repo;
        private readonly IDoctorAccessRepository _accessRepository;
        private readonly IMapper _mapper;

        public DoctorCommentService(IDoctorCommentRepository repo, IMapper mapper, IDoctorAccessRepository accessRepository)
        {
            _repo = repo;
            _mapper = mapper;
            _accessRepository = accessRepository;
        }

        public async Task<ServiceResult<DoctorCommentDto>> CreateAsync(CreateDoctorCommentDto dto)
        {
            var doctorAccess = await _accessRepository.GetByUser(dto.Token);

            if (doctorAccess == null)
            {
                return ServiceResult<DoctorCommentDto>.Fail("Access not found", StatusCodes.Status404NotFound);
            } else
            {
                var comment = new DoctorComment
                {
                    DoctorAccessId = doctorAccess.Id,
                    MedicalRecordId = dto.MedicalRecordId,
                    EsculabRecordId = dto.EsculabRecordId,
                    DoctorCommentTypeId = dto.DoctorCommentTypeId,
                    Content = dto.Content,
                    Date = DateTime.UtcNow,
                    IsPublic = dto.IsPublic
                };
                await _repo.AddAsync(comment);
                var resultDto = _mapper.Map<DoctorCommentDto>(comment);
                return ServiceResult<DoctorCommentDto>.Ok(resultDto);
            }
        }

        public async Task<ServiceResult<IEnumerable<DoctorCommentDto>>> GetByMedicalRecordAsync(Guid medicalRecordId)
        {
            var comments = await _repo.GetByMedicalRecordIdAsync(medicalRecordId);
            var dtos = _mapper.Map<IEnumerable<DoctorCommentDto>>(comments);
            return ServiceResult<IEnumerable<DoctorCommentDto>>.Ok(dtos);
        }

        public async Task<ServiceResult<IEnumerable<DoctorCommentTypeDto>>> GetCommentTypesAsync()
        {
            var types = await _repo.GetCommentTypesAsync();
            var dtos = _mapper.Map<IEnumerable<DoctorCommentTypeDto>>(types);
            return ServiceResult<IEnumerable<DoctorCommentTypeDto>>.Ok(dtos);
        }

        public async Task<ServiceResult<bool>> UpdateAsync(Guid id, CreateDoctorCommentDto dto)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null)
                return ServiceResult<bool>.Fail("Comment not found", StatusCodes.Status404NotFound);

            existing.Content = dto.Content;
            existing.DoctorCommentTypeId = dto.DoctorCommentTypeId;
            existing.Date = DateTime.UtcNow;
            await _repo.UpdateAsync(existing);
            return ServiceResult<bool>.Ok(true);
        }

        public async Task<ServiceResult<bool>> DeleteAsync(Guid id)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null)
                return ServiceResult<bool>.Fail("Comment not found", StatusCodes.Status404NotFound);

            await _repo.DeleteAsync(existing);
            return ServiceResult<bool>.Ok(true);
        }
    }
}
