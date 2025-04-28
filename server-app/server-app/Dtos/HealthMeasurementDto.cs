namespace server_app.Dtos
{
    public class HealthMeasurementDto { public Guid Id; public string MeasurementType = null!; public string Value = null!; }
    public class CreateHealthMeasurementDto { public Guid UserId; public string MeasurementType = null!; public string Value = null!; }
    public class UpdateHealthMeasurementDto { public string Value = null!; }
}
