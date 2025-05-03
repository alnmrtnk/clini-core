namespace server_app.Dtos
{
    public class CreateDoctorAccessDto
    {
        public string Name { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
        public string? TargetEmail { get; set; }
    }

    public class DoctorAccessDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Token { get; set; }
        public DateTime ExpiresAt { get; set; }
        public bool Revoked { get; set; }
    }
}
