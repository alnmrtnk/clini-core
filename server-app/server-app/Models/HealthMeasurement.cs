namespace server_app.Models
{
    public class HealthMeasurement
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string MeasurementType { get; set; } = null!;
        public string Value { get; set; } = null!;
        public DateTime MeasuredAt { get; set; }
        public User User { get; set; } = null!;
    }
}
