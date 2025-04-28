using server_app.Dtos;
using server_app.Repositories;

namespace server_app.Services
{
    public interface IVaccinationService
    {
        Task<IEnumerable<VaccinationDto>> GetAllAsync();
        Task<VaccinationDto> GetByIdAsync(Guid id);
        Task<Guid> CreateAsync(CreateVaccinationDto dto);
        Task UpdateAsync(Guid id, UpdateVaccinationDto dto);
        Task DeleteAsync(Guid id);
    }

    public class VaccinationService : IVaccinationService
    {
        private readonly IVaccinationRepository _r;

        public VaccinationService(IVaccinationRepository r)
        {
            _r = r;
        }

        public Task<IEnumerable<VaccinationDto>> GetAllAsync() => _r.GetAllAsync();

        public Task<VaccinationDto> GetByIdAsync(Guid id) => _r.GetByIdAsync(id);

        public Task<Guid> CreateAsync(CreateVaccinationDto dto) => _r.AddAsync(dto);

        public Task UpdateAsync(Guid id, UpdateVaccinationDto dto) => _r.UpdateAsync(id, dto);

        public Task DeleteAsync(Guid id) => _r.DeleteAsync(id);
    }
}
