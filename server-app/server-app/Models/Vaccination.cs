namespace server_app.Models
{
    public class Vaccination
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string VaccineName { get; set; } = null!;
        public int DoseNumber { get; set; }
        public DateTime DateAdministered { get; set; }
        public User User { get; set; } = null!;
    }
}
