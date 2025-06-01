using System.Text.Json.Serialization;

namespace server_app.Models
{
    public class DoctorAccess
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string Name { get; set; }
        public required Guid OwnerUserId { get; set; }
        public Guid? TargetUserId { get; set; }
        public string? TargetUserEmail { get; set; }
        public string? Token { get; set; }
        public required DateTime ExpiresAt { get; set; }
        public bool Revoked { get; set; } = false;
        public DateTime GrantedAt { get; set; } = DateTime.UtcNow;
        [JsonIgnore]
        public User User { get; set; } = null!;
        [JsonIgnore]
        public User? SharedWithUser { get; set; }

        [JsonIgnore]
        public List<DoctorComment> DoctorComments { get; set; } = new List<DoctorComment>();
    }
}
