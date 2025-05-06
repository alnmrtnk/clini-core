namespace server_app.Dtos
{
    public class MedicalRecordFileDto
    {
        public Guid Id { get; set; }
        public Guid MedicalRecordId { get; set; }
        public string FileName { get; set; } = null!;
        public string S3Key { get; set; } = null!;
        public string Url { get; set; } = null!;
    }

    public class CreateMedicalRecordFileDto
    {
        public Guid MedicalRecordId { get; set; }
        public string FileName { get; set; } = null!;
        public string S3Key { get; set; } = null!;
    }
}
