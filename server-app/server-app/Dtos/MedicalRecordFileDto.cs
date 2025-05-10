namespace server_app.Dtos
{
    public class MedicalRecordFileDto
    {
        public required Guid Id { get; set; }
        public required Guid MedicalRecordId { get; set; }
        public required string FileName { get; set; }
        public required string S3Key { get; set; }
        public required string Url { get; set; }
    }

    public class CreateMedicalRecordFileDto
    {
        public required Guid MedicalRecordId { get; set; }
        public required string FileName { get; set; }
        public required string S3Key { get; set; }
    }
}
