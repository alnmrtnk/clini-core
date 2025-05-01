namespace server_app.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public DateTime? DateOfBirth { get; set; }
        public string? PhoneNumber { get; set; }
        public string? EsculabPatientId { get; set; }
        public string? EsculabPhoneNumber {  get; set; }
        public ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();
        public ICollection<Vaccination> Vaccinations { get; set; } = new List<Vaccination>();
        public ICollection<HealthMeasurement> HealthMeasurements { get; set; } = new List<HealthMeasurement>();
        public ICollection<DoctorAccess> DoctorAccesses { get; set; } = new List<DoctorAccess>();
    }
}
