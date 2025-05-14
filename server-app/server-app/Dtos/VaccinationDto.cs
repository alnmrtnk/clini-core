namespace server_app.Dtos
{
    public class VaccinationDto
    {
        public Guid Id { get; set; }
        public string VaccineName { get; set; } = null!;
        public DateTime DateAdministered { get; set; }
    }

    public class CreateVaccinationDto
    {
        public Guid UserId { get; set; }
        public string VaccineName { get; set; } = null!;
        public int DoseNumber { get; set; }
    }

    public class UpdateVaccinationDto
    {
        public int DoseNumber { get; set; }
    }
}
