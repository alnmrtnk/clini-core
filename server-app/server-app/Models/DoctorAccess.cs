namespace server_app.Models
{
    public class DoctorAccess
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string DoctorName { get; set; } = null!;
        public DateTime GrantedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public User User { get; set; } = null!;
    }
}
