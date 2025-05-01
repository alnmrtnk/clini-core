using server_app.Dtos;
using server_app.Helpers;
using server_app.Repositories;

namespace server_app.Services
{
    public interface IMedicalRecordService
    {
        Task<ServiceResult<IEnumerable<MedicalRecordDto>>> GetAllAsync();
        Task<ServiceResult<MedicalRecordDto>> GetByIdAsync(Guid id);
        Task<ServiceResult<Guid>> CreateAsync(CreateMedicalRecordDto dto);
        Task<ServiceResult<bool>> UpdateAsync(Guid id, UpdateMedicalRecordDto dto);
        Task<ServiceResult<bool>> DeleteAsync(Guid id);
    }

    public class MedicalRecordService : IMedicalRecordService
    {
        private readonly IMedicalRecordRepository _r;

        public MedicalRecordService(IMedicalRecordRepository r)
        {
            _r = r;
        }

        public async Task<ServiceResult<IEnumerable<MedicalRecordDto>>> GetAllAsync()
        {
            var items = await _r.GetAllAsync();
            return ServiceResult<IEnumerable<MedicalRecordDto>>.Ok(items);
        }

        public async Task<ServiceResult<MedicalRecordDto>> GetByIdAsync(Guid id)
        {
            var record = await _r.GetByIdAsync(id);
            return record == null
                ? ServiceResult<MedicalRecordDto>.Fail("Not found", StatusCodes.Status404NotFound)
                : ServiceResult<MedicalRecordDto>.Ok(record);
        }

        public async Task<ServiceResult<Guid>> CreateAsync(CreateMedicalRecordDto dto)
        {
            var id = await _r.AddAsync(dto);
            return ServiceResult<Guid>.Ok(id);
        }

        public async Task<ServiceResult<bool>> UpdateAsync(Guid id, UpdateMedicalRecordDto dto)
        {
            var success = await _r.UpdateAsync(id, dto);
            return success
                ? ServiceResult<bool>.Ok(true)
                : ServiceResult<bool>.Fail("Record not found", StatusCodes.Status404NotFound);
        }

        public async Task<ServiceResult<bool>> DeleteAsync(Guid id)
        {
            var success = await _r.DeleteAsync(id);
            return success
                ? ServiceResult<bool>.Ok(true)
                : ServiceResult<bool>.Fail("Record not found", StatusCodes.Status404NotFound);
        }
    }
}
