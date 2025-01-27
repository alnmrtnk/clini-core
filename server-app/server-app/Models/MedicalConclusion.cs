namespace server_app.Models
{
    public class MedicalConclusion : MedicalRecordRelationship
    {
        public int DiagnoseId { get; set; }

        public int LabResultId { get; set; }

        public string ConclusionText { get; set; } = string.Empty;

        public string LifestyleReccommendations {  get; set; } = string.Empty;

        public DateTime IssueDate { get; set; } = DateTime.UtcNow;

        public Diagnose Diagnose { get; set; } = null!;

        public LabResult LabResult { get; set; } = null!;

    }
}
