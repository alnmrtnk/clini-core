using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server_app.Data;
using server_app.Dtos;
using server_app.Models;

namespace server_app.Repositories
{
    public interface IHealthMeasurementRepository
    {
        Task<IEnumerable<HealthMeasurementDto>> GetAllAsync();
        Task<HealthMeasurementDto> GetByIdAsync(Guid id);
        Task<Guid> AddAsync(CreateHealthMeasurementDto dto);
        Task UpdateAsync(Guid id, UpdateHealthMeasurementDto dto);
        Task DeleteAsync(Guid id);
    }

    public class HealthMeasurementRepository : IHealthMeasurementRepository
    {
        private readonly AppDbContext _db;

        private readonly IMapper _map;

        public HealthMeasurementRepository(AppDbContext db, IMapper map)
        {
            _db = db;
            _map = map;
        }

        public async Task<IEnumerable<HealthMeasurementDto>> GetAllAsync() =>
            _map.Map<IEnumerable<HealthMeasurementDto>>(await _db.HealthMeasurements.ToListAsync());

        public async Task<HealthMeasurementDto> GetByIdAsync(Guid id) =>
            _map.Map<HealthMeasurementDto>(await _db.HealthMeasurements.FindAsync(id));

        public async Task<Guid> AddAsync(CreateHealthMeasurementDto dto)
        {
            var e = _map.Map<HealthMeasurement>(dto);
            _db.HealthMeasurements.Add(e);
            await _db.SaveChangesAsync();
            return e.Id;
        }

        public async Task UpdateAsync(Guid id, UpdateHealthMeasurementDto dto)
        {
            var e = await _db.HealthMeasurements.FindAsync(id);
            _map.Map(dto, e);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var e = await _db.HealthMeasurements.FindAsync(id);

            if (e != null)
            {
                _db.HealthMeasurements.Remove(e);
                await _db.SaveChangesAsync();
            }
        }
    }
}
