namespace server_app.Dtos
{
    public class MedicalRecordDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public DateTime Date { get; set; }
        public string RecordTypeName { get; set; } = null!;
    }


    public class CreateMedicalRecordDto
    {
        public Guid UserId { get; set; }
        public Guid RecordTypeId { get; set; }
        public string Title { get; set; } = null!;
        public DateTime Date { get; set; }
    }


    public class UpdateMedicalRecordDto
    {
        public string Title { get; set; } = null!;
    }
}
