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

    public class DoctorAccessRepository : IDoctorAccessRepository
    {
        private readonly AppDbContext _db;

        private readonly IMapper _map;

        public DoctorAccessRepository(AppDbContext db, IMapper map)
        {
            _db = db;
            _map = map;
        }

        public async Task<IEnumerable<DoctorAccessDto>> GetAllByUserAsync(Guid userId) =>
            _map.Map<IEnumerable<DoctorAccessDto>>(
                await _db.DoctorAccesses.Where(a => a.UserId == userId).ToListAsync()
            );

        public async Task<Guid> AddAsync(CreateDoctorAccessDto dto)
        {
            var e = _map.Map<DoctorAccess>(dto);
            _db.DoctorAccesses.Add(e);
            await _db.SaveChangesAsync();
            return e.Id;
        }

        public async Task DeleteAsync(Guid id)
        {
            var e = await _db.DoctorAccesses.FindAsync(id);

            if (e != null)
            {
                _db.DoctorAccesses.Remove(e);
                await _db.SaveChangesAsync();
            }
        }
    }
}
