using System.ComponentModel.DataAnnotations;

namespace server_app.Models
{
    public class LabResult : MedicalRecordRelationship
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Result { get; set; } = string.Empty;

        [Required]
        public DateTime Date { get; set; }
    }
}
