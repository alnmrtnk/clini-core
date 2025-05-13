using server_app.Models;

namespace server_app.Dtos
{
    public class MedicalRecordDto
    {
        public required Guid Id { get; set; }
        public required string Title { get; set; } = null!;
        public required DateTime Date { get; set; }
        public required string RecordTypeName { get; set; } = null!;

        public string? Notes { get; set; }

        public required Guid UserId { get; set; }

        public List<MedicalRecordFileDto> Files { get; set; } = new();

        public required UserDto User { get; set; } = null!;
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

    public class MedicalRecordGroupDto
    {
        public Guid OwnerUserId { get; set; }
        public string OwnerName { get; set; } = null!;
        public string OwnerEmail { get; set; } = null!;
        public List<MedicalRecordDto> Records { get; set; } = new();
    }
}
