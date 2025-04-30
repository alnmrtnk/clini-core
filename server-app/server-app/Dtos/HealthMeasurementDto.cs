namespace server_app.Dtos
{
    public class HealthMeasurementDto
    {
        public Guid Id { get; set; }
        public string MeasurementType { get; set; } = null!;
        public string Value { get; set; } = null!;
    }

    public class CreateHealthMeasurementDto
    {
        public Guid UserId { get; set; }
        public string MeasurementType { get; set; } = null!;
        public string Value { get; set; } = null!;
    }

    public class UpdateHealthMeasurementDto
    {
        public string Value { get; set; } = null!;
    }
}
