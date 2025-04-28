using server_app.Dtos;
using server_app.Repositories;

namespace server_app.Services
{
    public interface IDoctorAccessService
    {
        Task<IEnumerable<DoctorAccessDto>> GetByUserIdAsync(Guid id);
        Task<Guid> CreateAsync(CreateDoctorAccessDto dto);
        Task DeleteAsync(Guid id);
    }

    public class DoctorAccessService : IDoctorAccessService
    {
        private readonly IDoctorAccessRepository _r;

        public DoctorAccessService(IDoctorAccessRepository r)
        {
            _r = r;
        }

        public Task<IEnumerable<DoctorAccessDto>> GetByUserIdAsync(Guid id) =>
            _r.GetAllByUserAsync(id);

        public Task<Guid> CreateAsync(CreateDoctorAccessDto dto) => _r.AddAsync(dto);

        public Task DeleteAsync(Guid id) => _r.DeleteAsync(id);
    }
}
