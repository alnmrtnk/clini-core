namespace server_app.Models
{
    public class RecordType
    {
        public required Guid Id { get; set; }
        public required string Name { get; set; } = null!;
        public ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();
    }
}

