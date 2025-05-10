namespace server_app.Dtos
{
    public class MedicalRecordDto
    {
        public required Guid Id { get; set; }
        public required string Title { get; set; } = null!;
        public required DateTime Date { get; set; }
        public required string RecordTypeName { get; set; } = null!;

        public string? Notes { get; set; }

        public List<MedicalRecordFileDto> Files { get; set; } = new();
    }


    public class CreateMedicalRecordDto
    {
        public required Guid RecordTypeId { get; set; }
        public required string Title { get; set; } = null!;
        public required DateTime Date { get; set; }
        public string? Notes { get; set; }
    }


    public class UpdateMedicalRecordDto
    {
        public string? Title { get; set; } = null!;

        public string? Notes { get; set; }
    }
}
