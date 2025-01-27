using System.ComponentModel.DataAnnotations;

namespace server_app.Models
{
    public abstract class MedicalRecordRelationship : BaseEntity
    {
        [Required]
        public int PatientId { get; set; }

        public int MedicalStaffId { get; set; }

        public Patient Patient { get; set; } = null!;

        public MedicalStaff MedicalStaff { get; set; } = null!;
    }

}
