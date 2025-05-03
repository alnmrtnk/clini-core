namespace server_app.Dtos
{
    public class MedicalRecordDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public DateTime Date { get; set; }
        public string RecordTypeName { get; set; } = null!;

        public string? Notes { get; set; }

        public List<MedicalRecordFileDto> Files { get; set; } = new();
    }


    public class CreateMedicalRecordDto
    {
        public Guid RecordTypeId { get; set; }
        public string Title { get; set; } = null!;
        public DateTime Date { get; set; }
        public string? Notes { get; set; }
    }


    public class UpdateMedicalRecordDto
    {
        public string Title { get; set; } = null!;

        public string? Notes { get; set; }
    }
}
