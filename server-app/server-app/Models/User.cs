using System.ComponentModel.DataAnnotations;

namespace server_app.Models
{
    public abstract class User : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Email { get; set; } = string.Empty;

        [Required]
        public int PhoneNumber { get; set; }
    }
}
