using server_app.Dtos;
using server_app.Helpers;
using server_app.Repositories;

namespace server_app.Services
{
    public interface IVaccinationService
    {
        Task<ServiceResult<IEnumerable<VaccinationDto>>> GetAllAsync();
        Task<ServiceResult<VaccinationDto>> GetByIdAsync(Guid id);
        Task<ServiceResult<Guid>> CreateAsync(CreateVaccinationDto dto);
        Task<ServiceResult<bool>> UpdateAsync(Guid id, UpdateVaccinationDto dto);
        Task<ServiceResult<bool>> DeleteAsync(Guid id);
    }

    public class VaccinationService : IVaccinationService
    {
        private readonly IVaccinationRepository _r;

        public VaccinationService(IVaccinationRepository r)
        {
            _r = r;
        }

        public Task<ServiceResult<IEnumerable<VaccinationDto>>> GetAllAsync()
        {
            var now = DateTime.UtcNow;
            var mockData = new List<VaccinationDto>
            {
                // Past doses
                new VaccinationDto {
                    Id = Guid.NewGuid(),
                    VaccineName = "Pfizer-BioNTech",
                    DateAdministered = now.AddDays(-60)
                },
                new VaccinationDto {
                    Id = Guid.NewGuid(),
                    VaccineName = "Moderna",
                    DateAdministered = now.AddDays(-45)
                },
                new VaccinationDto {
                    Id = Guid.NewGuid(),
                    VaccineName = "Johnson & Johnson (Janssen)",
                    DateAdministered = now.AddDays(-30)
                },
                new VaccinationDto {
                    Id = Guid.NewGuid(),
                    VaccineName = "Novavax",
                    DateAdministered = now.AddDays(-15)
                },
                new VaccinationDto {
                    Id = Guid.NewGuid(),
                    VaccineName = "Sinopharm",
                    DateAdministered = now.AddDays(-7)
                },

                // Upcoming appointments
                new VaccinationDto {
                    Id = Guid.NewGuid(),
                    VaccineName = "Pfizer-BioNTech",
                    DateAdministered = now.AddDays(7)
                },
                new VaccinationDto {
                    Id = Guid.NewGuid(),
                    VaccineName = "Moderna",
                    DateAdministered = now.AddDays(14)
                },
                new VaccinationDto {
                    Id = Guid.NewGuid(),
                    VaccineName = "Johnson & Johnson (Janssen)",
                    DateAdministered = now.AddDays(21)
                },
                new VaccinationDto {
                    Id = Guid.NewGuid(),
                    VaccineName = "Novavax",
                    DateAdministered = now.AddDays(30)
                },
                new VaccinationDto {
                    Id = Guid.NewGuid(),
                    VaccineName = "Sinovac",
                    DateAdministered = now.AddDays(60)
                }
            };

            return Task.FromResult(
                ServiceResult<IEnumerable<VaccinationDto>>.Ok(mockData)
            );
        }



        public async Task<ServiceResult<VaccinationDto>> GetByIdAsync(Guid id)
        {
            var data = await _r.GetByIdAsync(id);
            return data == null
                ? ServiceResult<VaccinationDto>.Fail("Vaccination not found", StatusCodes.Status404NotFound)
                : ServiceResult<VaccinationDto>.Ok(data);
        }

        public async Task<ServiceResult<Guid>> CreateAsync(CreateVaccinationDto dto)
        {
            var id = await _r.AddAsync(dto);
            return ServiceResult<Guid>.Ok(id);
        }

        public async Task<ServiceResult<bool>> UpdateAsync(Guid id, UpdateVaccinationDto dto)
        {
            var success = await _r.UpdateAsync(id, dto);
            return success
                ? ServiceResult<bool>.Ok(true)
                : ServiceResult<bool>.Fail("Vaccination not found", StatusCodes.Status404NotFound);
        }

        public async Task<ServiceResult<bool>> DeleteAsync(Guid id)
        {
            var success = await _r.DeleteAsync(id);
            return success
                ? ServiceResult<bool>.Ok(true)
                : ServiceResult<bool>.Fail("Vaccination not found", StatusCodes.Status404NotFound);
        }
    }
}
