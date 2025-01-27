using System.ComponentModel.DataAnnotations;

namespace server_app.Models
{
    public class BloodPressure
    {
        [Required]
        [Range(0, 300)]
        public int Systolic { get; set; }

        [Required]
        [Range(0, 200)]
        public int Diastolic { get; set; }
    }
}
