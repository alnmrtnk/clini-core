using server_app.Models;

namespace server_app.Dtos
{
    public class RecordTypeDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;

        public List<MedicalRecordDto> MedicalRecords { get; set; } = new();
    }
}
