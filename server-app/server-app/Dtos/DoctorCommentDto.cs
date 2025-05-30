namespace server_app.Dtos
{
    public class DoctorCommentDto
    {
        public required Guid Id { get; set; }
        public required Guid DoctorAccessId { get; set; }
        public required Guid MedicalRecordId { get; set; }
        public required Guid DoctorCommentTypeId { get; set; }
        public required string DoctorCommentTypeName { get; set; }
        public required string DoctorName { get; set; }
        public required string Content { get; set; }
        public required DateTime Date { get; set; }
    }

    public class CreateDoctorCommentDto
    {
        public string? Token { get; set; } = null!;
        public required Guid MedicalRecordId { get; set; }
        public required Guid DoctorCommentTypeId { get; set; }
        public required string Content { get; set; }
    }
}
