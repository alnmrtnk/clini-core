namespace server_app.Dtos
{
    public class MedicalRecordDto { public Guid Id; public string Title = null!; public DateTime Date; }
    public class CreateMedicalRecordDto { public Guid UserId; public string RecordType = null!; public string Title = null!; public DateTime Date; }
    public class UpdateMedicalRecordDto { public string Title = null!; }
}
