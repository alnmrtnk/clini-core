namespace server_app.Models
{
    public class DoctorAccess
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = null!;
        public Guid OwnerUserId { get; set; }
        public Guid? TargetUserId { get; set; }
        public string? Token { get; set; }
        public DateTime ExpiresAt { get; set; }
        public bool Revoked { get; set; } = false;
        public DateTime GrantedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;
        public User? SharedWithUser { get; set; }
    }
}
