using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server_app.Data;
using server_app.Dtos;
using server_app.Models;

namespace server_app.Repositories
{
    public interface IVaccinationRepository
    {
        Task<IEnumerable<VaccinationDto>> GetAllAsync();
        Task<VaccinationDto> GetByIdAsync(Guid id);
        Task<Guid> AddAsync(CreateVaccinationDto dto);
        Task UpdateAsync(Guid id, UpdateVaccinationDto dto);
        Task DeleteAsync(Guid id);
    }

    public class VaccinationRepository : IVaccinationRepository
    {
        private readonly AppDbContext _db;

        private readonly IMapper _map;

        public VaccinationRepository(AppDbContext db, IMapper map)
        {
            _db = db;
            _map = map;
        }

        public async Task<IEnumerable<VaccinationDto>> GetAllAsync() =>
            _map.Map<IEnumerable<VaccinationDto>>(await _db.Vaccinations.ToListAsync());

        public async Task<VaccinationDto> GetByIdAsync(Guid id) =>
            _map.Map<VaccinationDto>(await _db.Vaccinations.FindAsync(id));

        public async Task<Guid> AddAsync(CreateVaccinationDto dto)
        {
            var e = _map.Map<Vaccination>(dto);
            _db.Vaccinations.Add(e);
            await _db.SaveChangesAsync();
            return e.Id;
        }

        public async Task UpdateAsync(Guid id, UpdateVaccinationDto dto)
        {
            var e = await _db.Vaccinations.FindAsync(id);
            _map.Map(dto, e);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var e = await _db.Vaccinations.FindAsync(id);

            if (e != null)
            {
                _db.Vaccinations.Remove(e);
                await _db.SaveChangesAsync();
            }
        }
    }
}
