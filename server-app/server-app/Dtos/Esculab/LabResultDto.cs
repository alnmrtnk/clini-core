using server_app.Extensions;
using System.Globalization;
using System.Text.Json.Serialization;

namespace server_app.Dtos.Esculab
{
    public class LabResultDto
    {
        public int idOrdertest { get; set; }
        public int id { get; set; }
        public int idgrtest { get; set; }
        public int idtest { get; set; }
        public int idgrnorm { get; set; }
        public string? result { get; set; }
        public string? barcode { get; set; }

        [JsonConverter(typeof(FlexibleDateTimeConverter))]
        public DateTime? utime { get; set; }

        public string? role { get; set; }
        public string? packet { get; set; }
        public string? test { get; set; }
        public string? state { get; set; }
        public string? resulttype { get; set; }
        public string? normheader { get; set; }
        public double height { get; set; }
        public int cnt { get; set; }
        public int idlaborant { get; set; }
        public int resultlighting { get; set; }
        public string? resulttmlt { get; set; }
        public string? material { get; set; }
        public string? post { get; set; }
        public string? laborant { get; set; }
        public string? norm { get; set; }
        public string? units { get; set; }
        public int patientId { get; set; }
        public string? patient { get; set; }

        [JsonConverter(typeof(FlexibleDateTimeConverter))]
        public DateTime? patientDt { get; set; }

        public int idOrder { get; set; }
        public int ready { get; set; }
    }

}
