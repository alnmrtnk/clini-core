namespace server_app.Dtos.Esculab
{
    public class EsculabOrderDto
    {
        public string Dt { get; set; } = null!;
        public int IdGrTest { get; set; }
        public string Address { get; set; } = null!;
        public string Ready { get; set; } = null!;
        public int Total { get; set; }
        public string? StringAgg { get; set; }
        public string Packet { get; set; } = null!;
        public int IdOrder { get; set; }
        public int IdClient { get; set; }
        public string Fullname { get; set; } = null!;
        public string State { get; set; } = null!;
        public bool Deleted { get; set; }
        public int Rating { get; set; }
        public bool Last { get; set; }
    }
}
