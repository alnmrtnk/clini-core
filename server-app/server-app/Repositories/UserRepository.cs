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
        Task<UserDto> GetCurrentUser();
        Task<Guid> AddAsync(CreateUserDto dto);
        Task<bool> UpdateAsync(UpdateUserDto dto);
        Task<User> GetEntityByEmailAsync(string email);
    }

    public class UserRepository : BaseRepository, IUserRepository
    {
        private readonly AppDbContext _db;
        private readonly IMapper _map;

        public UserRepository(AppDbContext db, IMapper map, IHttpContextAccessor accessor)
            : base(accessor)
        {
            _db = db;
            _map = map;
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync() =>
            _map.Map<IEnumerable<UserDto>>(await _db.Users.ToListAsync());

        public async Task<UserDto> GetByIdAsync(Guid id) =>
            _map.Map<UserDto>(await _db.Users.FindAsync(id));

        public async Task<UserDto> GetCurrentUser() =>
            _map.Map<UserDto>(await _db.Users.FindAsync(CurrentUserId));

        public async Task<Guid> AddAsync(CreateUserDto dto)
        {
            var entity = _map.Map<User>(dto);
            _db.Users.Add(entity);
            await _db.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<bool> UpdateAsync(UpdateUserDto dto)
        {
            var e = await _db.Users.FindAsync(CurrentUserId);
            if (e == null)
                return false;

            _map.Map(dto, e);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<User> GetEntityByEmailAsync(string email)
        {
            return await _db.Users.AsNoTracking().SingleOrDefaultAsync(u => u.Email == email);
        }
    }
}
