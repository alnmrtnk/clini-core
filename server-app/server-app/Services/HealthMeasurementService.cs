using server_app.Dtos;
using server_app.Repositories;

namespace server_app.Services
{
    public interface IHealthMeasurementService
    {
        Task<IEnumerable<HealthMeasurementDto>> GetAllAsync();
        Task<HealthMeasurementDto> GetByIdAsync(Guid id);
        Task<Guid> CreateAsync(CreateHealthMeasurementDto dto);
        Task UpdateAsync(Guid id, UpdateHealthMeasurementDto dto);
        Task DeleteAsync(Guid id);
    }

    public class HealthMeasurementService : IHealthMeasurementService
    {
        private readonly IHealthMeasurementRepository _r;

        public HealthMeasurementService(IHealthMeasurementRepository r)
        {
            _r = r;
        }

        public Task<IEnumerable<HealthMeasurementDto>> GetAllAsync() => _r.GetAllAsync();

        public Task<HealthMeasurementDto> GetByIdAsync(Guid id) => _r.GetByIdAsync(id);

        public Task<Guid> CreateAsync(CreateHealthMeasurementDto dto) => _r.AddAsync(dto);

        public Task UpdateAsync(Guid id, UpdateHealthMeasurementDto dto) => _r.UpdateAsync(id, dto);

        public Task DeleteAsync(Guid id) => _r.DeleteAsync(id);
    }
}
