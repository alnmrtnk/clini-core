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

    public class HealthMeasurementRepository : BaseRepository, IHealthMeasurementRepository
    {
        private readonly AppDbContext _db;
        private readonly IMapper _map;

        public HealthMeasurementRepository(AppDbContext db, IMapper map, IHttpContextAccessor accessor)
            : base(accessor)
        {
            _db = db;
            _map = map;
        }

        public async Task<IEnumerable<HealthMeasurementDto>> GetAllAsync() =>
            _map.Map<IEnumerable<HealthMeasurementDto>>(
                await _db.HealthMeasurements
                    .Where(h => h.UserId == CurrentUserId)
                    .ToListAsync()
            );

        public async Task<HealthMeasurementDto> GetByIdAsync(Guid id) =>
            _map.Map<HealthMeasurementDto>(
                await _db.HealthMeasurements
                    .FirstOrDefaultAsync(h => h.Id == id && h.UserId == CurrentUserId)
            );

        public async Task<Guid> AddAsync(CreateHealthMeasurementDto dto)
        {
            var entity = _map.Map<HealthMeasurement>(dto);
            entity.UserId = CurrentUserId;
            _db.HealthMeasurements.Add(entity);
            await _db.SaveChangesAsync();
            return entity.Id;
        }

        public async Task UpdateAsync(Guid id, UpdateHealthMeasurementDto dto)
        {
            var entity = await _db.HealthMeasurements
                .FirstOrDefaultAsync(h => h.Id == id && h.UserId == CurrentUserId);

            if (entity == null)
                throw new UnauthorizedAccessException("Access denied or record not found.");

            _map.Map(dto, entity);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await _db.HealthMeasurements
                .FirstOrDefaultAsync(h => h.Id == id && h.UserId == CurrentUserId);

            if (entity != null)
            {
                _db.HealthMeasurements.Remove(entity);
                await _db.SaveChangesAsync();
            }
        }
    }
}
