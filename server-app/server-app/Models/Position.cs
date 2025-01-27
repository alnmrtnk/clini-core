using System.ComponentModel.DataAnnotations;

namespace server_app.Models
{
    public class Position
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;
    }
}

