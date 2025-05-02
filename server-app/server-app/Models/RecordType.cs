namespace server_app.Models
{
    public class RecordType
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();
    }
}

