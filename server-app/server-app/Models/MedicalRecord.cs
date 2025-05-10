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

        public User User { get; set; } = null!;

        public RecordType RecordType { get; set; } = null!;

        public List<MedicalRecordFile> Files { get; set; } = new();

        public List<DoctorComment> DoctorComments { get; set; } = new();
    }

}
