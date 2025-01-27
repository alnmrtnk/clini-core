using System.ComponentModel.DataAnnotations;

namespace server_app.Models
{
    public class LabResult : MedicalRecordRelationship
    {
        [Required]
        public string TestName { get; set; } = string.Empty;

        [Required]
        public string TestResult { get; set; } = string.Empty;

        [Required]
        public DateTime TestDate { get; set; }
    }
}
