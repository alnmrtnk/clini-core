namespace server_app.Models
{
    public class User
    {
        public required Guid Id { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public required string FullName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? PhoneNumber { get; set; } = null!;
        public string? EsculabPatientId { get; set; } = null!;
        public string? EsculabPhoneNumber { get; set; } = null!;
        public ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();
        public ICollection<EsculabRecord> EsculabRecords { get; set; } = new List<EsculabRecord>();
        public ICollection<DoctorAccess> DoctorAccesses { get; set; } = new List<DoctorAccess>();
    }
}
