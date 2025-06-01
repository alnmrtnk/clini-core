using server_app.Dtos.Esculab;
using System.Text.Json.Serialization;

namespace server_app.Models
{
    public class EsculabRecord: EsculabOrderDto
    {
        public required Guid Id { get; set; }

        public required Guid UserId { get; set; }

        [JsonIgnore]
        public User User { get; set; } = null!;
        public List<DoctorComment> DoctorComments { get; set; } = new();
        public List<EsculabRecordDetails> EsculabRecordDetails { get; set; } = new();
    }
}