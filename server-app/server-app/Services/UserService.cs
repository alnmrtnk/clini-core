using server_app.Dtos;
using server_app.Helpers;
using server_app.Repositories;

namespace server_app.Services
{
    public interface IUserService
    {
        Task<ServiceResult<IEnumerable<UserDto>>> GetAllAsync();
        Task<ServiceResult<UserDto>> GetByIdAsync(Guid id);
        Task<ServiceResult<Guid>> CreateAsync(CreateUserDto dto);
        Task<ServiceResult<bool>> UpdateAsync(UpdateUserDto dto);
    }

    public class UserService : IUserService
    {
        private readonly IUserRepository _r;

        public UserService(IUserRepository r)
        {
            _r = r;
        }

        public async Task<ServiceResult<IEnumerable<UserDto>>> GetAllAsync()
        {
            var users = await _r.GetAllAsync();
            return ServiceResult<IEnumerable<UserDto>>.Ok(users);
        }

        public async Task<ServiceResult<UserDto>> GetByIdAsync(Guid id)
        {
            var user = await _r.GetByIdAsync(id);
            return user == null
                ? ServiceResult<UserDto>.Fail("User not found", StatusCodes.Status404NotFound)
                : ServiceResult<UserDto>.Ok(user);
        }

        public async Task<ServiceResult<Guid>> CreateAsync(CreateUserDto dto)
        {
            var id = await _r.AddAsync(dto);
            return ServiceResult<Guid>.Ok(id);
        }

        public async Task<ServiceResult<bool>> UpdateAsync(UpdateUserDto dto)
        {
            var success = await _r.UpdateAsync(dto);
            return success
                ? ServiceResult<bool>.Ok(true)
                : ServiceResult<bool>.Fail("User not found", StatusCodes.Status404NotFound);
        }
    }
}
