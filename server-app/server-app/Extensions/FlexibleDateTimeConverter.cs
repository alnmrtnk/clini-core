using System.Globalization;
using System.Text.Json.Serialization;
using System.Text.Json;

namespace server_app.Extensions
{
    public class FlexibleDateTimeConverter : JsonConverter<DateTime?>
    {
        private static readonly string[] Formats = new[]
        {
            "yyyy-MM-dd HH:mm:ss.FFFFFFzzz",   // +02:00
            "yyyy-MM-dd HH:mm:ss.FFFFFFzz",    // +0200
            "yyyy-MM-dd HH:mm:ss.FFFFFFz",     // +02
            "yyyy-MM-dd HH:mm:ss.FFFFFF",
            "yyyy-MM-dd HH:mm:ss",
            "yyyy-MM-dd HH:mm",
            "yyyy-MM-dd"
        };

        public override DateTime? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var str = reader.GetString();

            if (string.IsNullOrWhiteSpace(str))
                return null;

            if (DateTimeOffset.TryParse(str, CultureInfo.InvariantCulture, DateTimeStyles.None, out var dto))
            {
                return dto.UtcDateTime;
            }

            throw new JsonException($"Invalid datetime format: {str}");
        }

        public override void Write(Utf8JsonWriter writer, DateTime? value, JsonSerializerOptions options)
        {
            if (value.HasValue)
                writer.WriteStringValue(value.Value.ToString("yyyy-MM-dd HH:mm:ss"));
            else
                writer.WriteNullValue();
        }
    }


}
