using server_app.Dtos;
using server_app.Helpers;
using server_app.Repositories;

namespace server_app.Services
{
    public interface IDoctorAccessService
    {
        Task<ServiceResult<IEnumerable<DoctorAccessDto>>> GetByUserIdAsync(Guid id);
        Task<ServiceResult<Guid>> CreateAsync(CreateDoctorAccessDto dto);
        Task<ServiceResult<bool>> DeleteAsync(Guid id);
    }

    public class DoctorAccessService : IDoctorAccessService
    {
        private readonly IDoctorAccessRepository _r;

        public DoctorAccessService(IDoctorAccessRepository r)
        {
            _r = r;
        }

        public async Task<ServiceResult<IEnumerable<DoctorAccessDto>>> GetByUserIdAsync(Guid id)
        {
            var results = await _r.GetAllByUserAsync(id);
            return ServiceResult<IEnumerable<DoctorAccessDto>>.Ok(results);
        }

        public async Task<ServiceResult<Guid>> CreateAsync(CreateDoctorAccessDto dto)
        {
            var id = await _r.AddAsync(dto);
            return ServiceResult<Guid>.Ok(id);
        }

        public async Task<ServiceResult<bool>> DeleteAsync(Guid id)
        {
            var success = await _r.DeleteAsync(id);
            return success
                ? ServiceResult<bool>.Ok(true)
                : ServiceResult<bool>.Fail("Item not found.", StatusCodes.Status404NotFound);
        }
    }
}
