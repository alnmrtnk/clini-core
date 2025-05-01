using server_app.Dtos;
using server_app.Helpers;
using server_app.Repositories;

namespace server_app.Services
{
    public interface IHealthMeasurementService
    {
        Task<ServiceResult<IEnumerable<HealthMeasurementDto>>> GetAllAsync();
        Task<ServiceResult<HealthMeasurementDto>> GetByIdAsync(Guid id);
        Task<ServiceResult<Guid>> CreateAsync(CreateHealthMeasurementDto dto);
        Task<ServiceResult<bool>> UpdateAsync(Guid id, UpdateHealthMeasurementDto dto);
        Task<ServiceResult<bool>> DeleteAsync(Guid id);
    }

    public class HealthMeasurementService : IHealthMeasurementService
    {
        private readonly IHealthMeasurementRepository _r;

        public HealthMeasurementService(IHealthMeasurementRepository r)
        {
            _r = r;
        }

        public async Task<ServiceResult<IEnumerable<HealthMeasurementDto>>> GetAllAsync()
        {
            var data = await _r.GetAllAsync();
            return ServiceResult<IEnumerable<HealthMeasurementDto>>.Ok(data);
        }

        public async Task<ServiceResult<HealthMeasurementDto>> GetByIdAsync(Guid id)
        {
            var item = await _r.GetByIdAsync(id);
            return item == null
                ? ServiceResult<HealthMeasurementDto>.Fail("Not found", StatusCodes.Status404NotFound)
                : ServiceResult<HealthMeasurementDto>.Ok(item);
        }

        public async Task<ServiceResult<Guid>> CreateAsync(CreateHealthMeasurementDto dto)
        {
            var id = await _r.AddAsync(dto);
            return ServiceResult<Guid>.Ok(id);
        }

        public async Task<ServiceResult<bool>> UpdateAsync(Guid id, UpdateHealthMeasurementDto dto)
        {
            var updated = await _r.UpdateAsync(id, dto);

            return updated
                ? ServiceResult<bool>.Ok(true)
                : ServiceResult<bool>.Fail("Item not found", StatusCodes.Status404NotFound);
        }


        public async Task<ServiceResult<bool>> DeleteAsync(Guid id)
        {
            var result = await _r.DeleteAsync(id);
            return result
                ? ServiceResult<bool>.Ok(true)
                : ServiceResult<bool>.Fail("Item not found", StatusCodes.Status404NotFound);
        }
    }
}
