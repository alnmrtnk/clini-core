using server_app.Dtos;
using server_app.Repositories;

namespace server_app.Services
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllAsync();
        Task<UserDto> GetByIdAsync(Guid id);
        Task<Guid> CreateAsync(CreateUserDto dto);
        Task UpdateAsync(Guid id, UpdateUserDto dto);
        Task DeleteAsync(Guid id);
    }

    public class UserService : IUserService
    {
        private readonly IUserRepository _r;

        public UserService(IUserRepository r)
        {
            _r = r;
        }

        public Task<IEnumerable<UserDto>> GetAllAsync() => _r.GetAllAsync();

        public Task<UserDto> GetByIdAsync(Guid id) => _r.GetByIdAsync(id);

        public Task<Guid> CreateAsync(CreateUserDto dto) => _r.AddAsync(dto);

        public Task UpdateAsync(Guid id, UpdateUserDto dto) => _r.UpdateAsync(id, dto);

        public Task DeleteAsync(Guid id) => _r.DeleteAsync(id);
    }
}
