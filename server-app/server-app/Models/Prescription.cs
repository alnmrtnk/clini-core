using System.ComponentModel.DataAnnotations;

namespace server_app.Models
{
    public class Prescription : MedicalRecordRelationship
    {
        [Required]
        public string MedicationName { get; set; } = string.Empty;

        [Required]
        public DateTime PrescriptionDate { get; set; }

        public ICollection<PrescriptionLabResult> PrescriptionLabResults { get; set; } = new List<PrescriptionLabResult>();
    }
}
