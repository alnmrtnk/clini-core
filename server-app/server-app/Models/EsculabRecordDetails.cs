using server_app.Dtos.Esculab;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace server_app.Models
{
    public class EsculabRecordDetails : LabResultDto
    {
        [Key]
        public required Guid DetailsId { get; set; }

        public required Guid EsculabRecordId { get; set; }

        [JsonIgnore]
        [Required]
        public EsculabRecord EsculabRecord { get; set; }
    }
}
