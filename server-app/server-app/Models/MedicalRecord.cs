using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace server_app.Models
{
    public class MedicalRecord : MedicalRecordRelationship
    {
        public int Height { get; set; }

        public int Width { get; set; }

        [AllowNull]
        public BloodPressure BloodPressure { get; set; } = null;

        [Range(0, 200)]
        public int PulseRate { get; set; }

        public DateTime Date { get; set; } = DateTime.UtcNow;
    }
}
