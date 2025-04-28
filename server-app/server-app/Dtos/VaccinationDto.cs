namespace server_app.Dtos
{
    public class VaccinationDto { public Guid Id; public string VaccineName = null!; public DateTime DateAdministered; }
    public class CreateVaccinationDto { public Guid UserId; public string VaccineName = null!; public int DoseNumber; }
    public class UpdateVaccinationDto { public int DoseNumber; }
}
