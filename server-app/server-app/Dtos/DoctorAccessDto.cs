namespace server_app.Dtos
{
    public class DoctorAccessDto
    {
        public Guid Id { get; set; }
        public string DoctorName { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
    }

    public class CreateDoctorAccessDto
    {
        public Guid UserId { get; set; }
        public string DoctorName { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
    }
}
