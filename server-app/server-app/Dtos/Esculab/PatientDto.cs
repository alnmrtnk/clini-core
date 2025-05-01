using server_app.Extensions;
using System.Globalization;
using System.Text.Json.Serialization;

namespace server_app.Dtos.Esculab
{
    public class PatientDto
    {
        public int Id { get; set; }
        public string Firstname { get; set; } = null!;
        public string Lastname { get; set; } = null!;
        public string Fathername { get; set; } = null!;
        public string Sex { get; set; } = null!;

        [JsonConverter(typeof(FlexibleDateTimeConverter))]
        public DateTime? Birthday { get; set; }

        public string Phone { get; set; } = null!;
        public string Email { get; set; } = null!;

        [JsonConverter(typeof(FlexibleDateTimeConverter))]
        public DateTime? RegDate { get; set; }

        public double ConstantDisc { get; set; }
        public string Detail { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public int IdUser { get; set; }
        public int IdDoctor { get; set; }
        public string? Password { get; set; }
        public string? Login { get; set; }
        public int IdParent { get; set; }
        public string PatientRole { get; set; } = null!;
        public bool Main { get; set; }
    }

}
