namespace server_app.Dtos
{
    public class CreateDoctorAccessDto
    {
        public required string Name { get; set; } = null!;
        public required DateTime ExpiresAt { get; set; }
        public string? TargetUserEmail { get; set; }
    }

    public class DoctorAccessDto
    {
        public required Guid Id { get; set; }
        public required string Name { get; set; }
        public string? Token { get; set; }
        public string? TargetUserEmail { get; set; }
        public required DateTime ExpiresAt { get; set; }
        public bool Revoked { get; set; } = false;
    }
}
