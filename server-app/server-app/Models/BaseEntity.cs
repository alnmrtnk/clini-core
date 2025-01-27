using System.ComponentModel.DataAnnotations;

namespace server_app.Models
{
    public abstract class BaseEntity
    {
        [Key]
        public int Id { get; set; }
    }
}
