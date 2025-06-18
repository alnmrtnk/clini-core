using System.Globalization;
using System.Text.Json.Serialization;

namespace server_app.Models
{
    public class DoctorComment
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public required Guid DoctorAccessId { get; set; }

        public Guid? MedicalRecordId { get; set; }
        public Guid? EsculabRecordId { get; set; }

        public required Guid DoctorCommentTypeId { get; set; }

        public required string Content { get; set; }

        public DateTime Date {  get; set; } = DateTime.UtcNow;

        public bool IsPublic { get; set; } = false;

        public DoctorAccess DoctorAccess { get; set; } = null!;

        [JsonIgnore]
        public MedicalRecord? MedicalRecord { get; set; } = null!;

        [JsonIgnore]
        public EsculabRecord? EsculabRecord { get; set; } = null!;

        public DoctorCommentType DoctorCommentType { get; set; } = null!;
    }
}
