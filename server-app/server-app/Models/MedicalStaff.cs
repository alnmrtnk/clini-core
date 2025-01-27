using System.ComponentModel.DataAnnotations;

namespace server_app.Models
{
    public class MedicalStaff : User
    {
        [Required]
        public int PositionId { get; set; }

        public Position Position { get; set; } = null!;
    }
}
