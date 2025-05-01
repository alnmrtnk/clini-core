using server_app.Dtos;
using server_app.Helpers;
using server_app.Repositories;

namespace server_app.Services
{
    public interface IVaccinationService
    {
        Task<ServiceResult<IEnumerable<VaccinationDto>>> GetAllAsync();
        Task<ServiceResult<VaccinationDto>> GetByIdAsync(Guid id);
        Task<ServiceResult<Guid>> CreateAsync(CreateVaccinationDto dto);
        Task<ServiceResult<bool>> UpdateAsync(Guid id, UpdateVaccinationDto dto);
        Task<ServiceResult<bool>> DeleteAsync(Guid id);
    }

    public class VaccinationService : IVaccinationService
    {
        private readonly IVaccinationRepository _r;

        public VaccinationService(IVaccinationRepository r)
        {
            _r = r;
        }

        public async Task<ServiceResult<IEnumerable<VaccinationDto>>> GetAllAsync()
        {
            var data = await _r.GetAllAsync();
            return ServiceResult<IEnumerable<VaccinationDto>>.Ok(data);
        }

        public async Task<ServiceResult<VaccinationDto>> GetByIdAsync(Guid id)
        {
            var data = await _r.GetByIdAsync(id);
            return data == null
                ? ServiceResult<VaccinationDto>.Fail("Vaccination not found", StatusCodes.Status404NotFound)
                : ServiceResult<VaccinationDto>.Ok(data);
        }

        public async Task<ServiceResult<Guid>> CreateAsync(CreateVaccinationDto dto)
        {
            var id = await _r.AddAsync(dto);
            return ServiceResult<Guid>.Ok(id);
        }

        public async Task<ServiceResult<bool>> UpdateAsync(Guid id, UpdateVaccinationDto dto)
        {
            var success = await _r.UpdateAsync(id, dto);
            return success
                ? ServiceResult<bool>.Ok(true)
                : ServiceResult<bool>.Fail("Vaccination not found", StatusCodes.Status404NotFound);
        }

        public async Task<ServiceResult<bool>> DeleteAsync(Guid id)
        {
            var success = await _r.DeleteAsync(id);
            return success
                ? ServiceResult<bool>.Ok(true)
                : ServiceResult<bool>.Fail("Vaccination not found", StatusCodes.Status404NotFound);
        }
    }
}
