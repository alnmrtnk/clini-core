namespace server_app.Models
{
    public class MedicalRecordFile
    {
        public Guid Id { get; set; }
        public Guid MedicalRecordId { get; set; }
        public string FileName { get; set; } = null!;
        public string S3Key { get; set; } = null!;

        public MedicalRecord MedicalRecord { get; set; } = null!;
    }

}
