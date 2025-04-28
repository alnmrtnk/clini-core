using server_app.Dtos;
using server_app.Repositories;

namespace server_app.Services
{
    public interface IMedicalRecordService
    {
        Task<IEnumerable<MedicalRecordDto>> GetAllAsync();
        Task<MedicalRecordDto> GetByIdAsync(Guid id);
        Task<Guid> CreateAsync(CreateMedicalRecordDto dto);
        Task UpdateAsync(Guid id, UpdateMedicalRecordDto dto);
        Task DeleteAsync(Guid id);
    }

    public class MedicalRecordService : IMedicalRecordService
    {
        private readonly IMedicalRecordRepository _r;

        public MedicalRecordService(IMedicalRecordRepository r)
        {
            _r = r;
        }

        public Task<IEnumerable<MedicalRecordDto>> GetAllAsync() => _r.GetAllAsync();

        public Task<MedicalRecordDto> GetByIdAsync(Guid id) => _r.GetByIdAsync(id);

        public Task<Guid> CreateAsync(CreateMedicalRecordDto dto) => _r.AddAsync(dto);

        public Task UpdateAsync(Guid id, UpdateMedicalRecordDto dto) => _r.UpdateAsync(id, dto);

        public Task DeleteAsync(Guid id) => _r.DeleteAsync(id);
    }
}
