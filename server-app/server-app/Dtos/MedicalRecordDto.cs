namespace server_app.Dtos
{
    public class MedicalRecordDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public DateTime Date { get; set; }
    }

    public class CreateMedicalRecordDto
    {
        public Guid UserId { get; set; }
        public string RecordType { get; set; } = null!;
        public string Title { get; set; } = null!;
        public DateTime Date { get; set; }
    }

    public class UpdateMedicalRecordDto
    {
        public string Title { get; set; } = null!;
    }
}
