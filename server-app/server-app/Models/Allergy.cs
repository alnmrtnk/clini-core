using System.ComponentModel.DataAnnotations;

namespace server_app.Models
{
    public class Allergy : BaseEntity
    {
        [Required]
        public int PatientId {  get; set; }

        [Required]
        public string AllergyName { get; set; } = string.Empty;

        public string Symptoms { get; set; } = string.Empty;

        public Patient Patient { get; set; } = null!;
    }
}
