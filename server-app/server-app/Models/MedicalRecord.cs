namespace server_app.Models
{
    public class MedicalRecord
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string RecordType { get; set; } = null!;
        public string Title { get; set; } = null!;
        public DateTime Date { get; set; }
        public User User { get; set; } = null!;
    }
}
