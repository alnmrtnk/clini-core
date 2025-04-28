namespace server_app.Dtos
{
    public class DoctorAccessDto { public Guid Id; public string DoctorName = null!; public DateTime ExpiresAt; }
    public class CreateDoctorAccessDto { public Guid UserId; public string DoctorName = null!; public DateTime ExpiresAt; }
}
