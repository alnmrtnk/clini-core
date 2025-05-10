namespace server_app.Models
{
    public class MedicalRecordFile
    {
        public required Guid Id { get; set; }
        public required Guid MedicalRecordId { get; set; }
        public required string FileName { get; set; }
        public required string S3Key { get; set; }

        public MedicalRecord MedicalRecord { get; set; } = null!;
    }

}
