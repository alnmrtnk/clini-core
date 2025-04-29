using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server_app.Data;
using server_app.Dtos;
using server_app.Models;

namespace server_app.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<UserDto>> GetAllAsync();
        Task<UserDto> GetByIdAsync(Guid id);
        Task<Guid> AddAsync(CreateUserDto dto);
        Task UpdateAsync(Guid id, UpdateUserDto dto);
        Task DeleteAsync(Guid id);
        Task<User> GetEntityByEmailAsync(string email);
    }

    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _db;
        private readonly IMapper _map;

        public UserRepository(AppDbContext db, IMapper map)
        {
            _db = db;
            _map = map;
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync() =>
            _map.Map<IEnumerable<UserDto>>(await _db.Users.ToListAsync());

        public async Task<UserDto> GetByIdAsync(Guid id) =>
            _map.Map<UserDto>(await _db.Users.FindAsync(id));

        public async Task<Guid> AddAsync(CreateUserDto dto)
        {
            var entity = _map.Map<User>(dto);
            _db.Users.Add(entity);
            await _db.SaveChangesAsync();
            return entity.Id;
        }

        public async Task UpdateAsync(Guid id, UpdateUserDto dto)
        {
            var e = await _db.Users.FindAsync(id);
            _map.Map(dto, e);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var e = await _db.Users.FindAsync(id);

            if (e != null)
            {
                _db.Users.Remove(e);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<User> GetEntityByEmailAsync(string email)
        {
            return await _db.Users.AsNoTracking().SingleOrDefaultAsync(u => u.Email == email);
        }
    }
}
