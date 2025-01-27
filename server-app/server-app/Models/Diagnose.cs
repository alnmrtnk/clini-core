using System.ComponentModel.DataAnnotations;

namespace server_app.Models
{
    public class Diagnose : MedicalRecordRelationship
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public DateTime Date { get; set; } = DateTime.UtcNow;

        [Required]
        public TreatmentStatus Status { get; set; } = TreatmentStatus.NotStarted;
    }

    public enum TreatmentStatus
    {
        NotStarted,
        InProgress,
        Completed,
        Canceled
    }
}
