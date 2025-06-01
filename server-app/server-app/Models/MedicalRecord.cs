using System.Text.Json.Serialization;

namespace server_app.Models
{
    public class MedicalRecord
    {
        public required Guid Id { get; set; }

        public required Guid UserId { get; set; }

        public required Guid RecordTypeId { get; set; }

        public required string Title { get; set; }

        public string? Notes { get; set; } = null!;

        public required DateTime Date { get; set; }

        [JsonIgnore]
        public User User { get; set; } = null!;

        [JsonIgnore]
        public RecordType RecordType { get; set; } = null!;

        [JsonIgnore]
        public List<MedicalRecordFile> Files { get; set; } = new();

        [JsonIgnore]
        public List<DoctorComment> DoctorComments { get; set; } = new();
    }

}
