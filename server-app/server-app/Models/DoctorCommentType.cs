using System.Text.Json.Serialization;

namespace server_app.Models
{
    public class DoctorCommentType
    {
        public required Guid Id { get; set; }
        public required string Name { get; set; }

        [JsonIgnore]
        public List<DoctorComment> DoctorComments { get; set; } = new List<DoctorComment>();
    }
}
