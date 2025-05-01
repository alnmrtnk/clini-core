namespace server_app.Dtos.Esculab
{
    public class RequestCodeDto
    {
        public string Phone { get; set; } = null!;
        public string Uuid { get; set; } = Guid.NewGuid().ToString();
    }
}
