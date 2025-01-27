using System.ComponentModel.DataAnnotations;

namespace server_app.Models
{
    public class Vaccination : MedicalRecordRelationship
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Series { get; set; } = string.Empty;

        [Required]
        public DateTime Date { get; set; } = DateTime.UtcNow;
    }
}
