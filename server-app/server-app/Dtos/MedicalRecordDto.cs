using Microsoft.AspNetCore.Mvc;
using server_app.Models;

namespace server_app.Dtos
{
    public class MedicalRecordDto
    {
        public required Guid Id { get; set; }
        public required string Title { get; set; } = null!;
        public required DateTime Date { get; set; }
        public required RecordTypeDto RecordType { get; set; }

        public string? Notes { get; set; }

        public required Guid UserId { get; set; }

        public UserDto User { get; set; } = null!;

        public IList<MedicalRecordFileDto> Files { get; set; } = new List<MedicalRecordFileDto>();
        public IList<DoctorComment> DoctorComments { get; set; } = new List<DoctorComment>();
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
        public required Guid RecordTypeId { get; set; }
        public required string Title { get; set; }
        public required DateTime Date { get; set; }
        public string? Notes { get; set; }

        [FromForm(Name = "removedFiles")]
        public List<Guid> RemovedFiles { get; set; } = new();
    }

    public class MedicalRecordGroupDto
    {
        public Guid OwnerUserId { get; set; }
        public string OwnerName { get; set; } = null!;
        public string OwnerEmail { get; set; } = null!;
        public List<MedicalRecordDto> Records { get; set; } = new();
        public List<EsculabRecord> EsculabRecords { get; set; } = new();
    }
}
