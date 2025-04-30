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

    public class VaccinationRepository : BaseRepository, IVaccinationRepository
    {
        private readonly AppDbContext _db;
        private readonly IMapper _map;

        public VaccinationRepository(AppDbContext db, IMapper map, IHttpContextAccessor accessor)
            : base(accessor)
        {
            _db = db;
            _map = map;
        }

        public async Task<IEnumerable<VaccinationDto>> GetAllAsync() =>
            _map.Map<IEnumerable<VaccinationDto>>(
                await _db.Vaccinations
                    .Where(x => x.UserId == CurrentUserId)
                    .ToListAsync()
            );

        public async Task<VaccinationDto> GetByIdAsync(Guid id) =>
            _map.Map<VaccinationDto>(
                await _db.Vaccinations
                    .FirstOrDefaultAsync(x => x.Id == id && x.UserId == CurrentUserId)
            );

        public async Task<Guid> AddAsync(CreateVaccinationDto dto)
        {
            var entity = _map.Map<Vaccination>(dto);
            entity.UserId = CurrentUserId;
            _db.Vaccinations.Add(entity);
            await _db.SaveChangesAsync();
            return entity.Id;
        }

        public async Task UpdateAsync(Guid id, UpdateVaccinationDto dto)
        {
            var entity = await _db.Vaccinations
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == CurrentUserId);

            if (entity == null)
                throw new UnauthorizedAccessException("Access denied or record not found.");

            _map.Map(dto, entity);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await _db.Vaccinations
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == CurrentUserId);

            if (entity != null)
            {
                _db.Vaccinations.Remove(entity);
                await _db.SaveChangesAsync();
            }
        }
    }
}
