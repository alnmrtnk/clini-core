using System.ComponentModel.DataAnnotations;

namespace server_app.Models
{
    public class PrescriptionLabResult
    {
        [Required]
        public int PrescriptionId { get; set; }
        public Prescription Prescription { get; set; } = null!;

        [Required]
        public int LabResultId { get; set; }
        public LabResult LabResult { get; set; } = null!;
    }
}
