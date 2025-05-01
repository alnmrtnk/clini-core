namespace server_app.Dtos.Esculab
{
    public class AcceptTokenResponseDto
    {
        public string token { get; set; } = string.Empty;
        public bool exist { get; set; } = false;
    }
}
