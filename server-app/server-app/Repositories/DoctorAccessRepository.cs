using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server_app.Data;
using server_app.Dtos;
using server_app.Models;

namespace server_app.Repositories
{
    public interface IDoctorAccessRepository
    {
        Task<IEnumerable<DoctorAccessDto>> GetAllByUserAsync(Guid userId);
        Task<Guid> AddAsync(CreateDoctorAccessDto dto);
        Task DeleteAsync(Guid id);
    }

    public class DoctorAccessRepository : BaseRepository, IDoctorAccessRepository
    {
        private readonly AppDbContext _db;
        private readonly IMapper _map;

        public DoctorAccessRepository(AppDbContext db, IMapper map, IHttpContextAccessor accessor)
            : base(accessor)
        {
            _db = db;
            _map = map;
        }

        public async Task<IEnumerable<DoctorAccessDto>> GetAllByUserAsync(Guid userId)
        {
            if (userId != CurrentUserId)
                throw new UnauthorizedAccessException("Access to this user's data is denied.");

            return _map.Map<IEnumerable<DoctorAccessDto>>(
                await _db.DoctorAccesses
                    .Where(x => x.UserId == userId)
                    .ToListAsync()
            );
        }

        public async Task<Guid> AddAsync(CreateDoctorAccessDto dto)
        {
            var entity = _map.Map<DoctorAccess>(dto);
            entity.UserId = CurrentUserId;
            _db.DoctorAccesses.Add(entity);
            await _db.SaveChangesAsync();
            return entity.Id;
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await _db.DoctorAccesses
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == CurrentUserId);

            if (entity != null)
            {
                _db.DoctorAccesses.Remove(entity);
                await _db.SaveChangesAsync();
            }
        }
    }
}
