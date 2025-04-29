namespace server_app.Dtos
{
    public record RegisterDto(string Email, string Password, string FullName);
    public record LoginDto(string Email, string Password);
    public record AuthResponse(string Token, Guid UserId, string Email);
}
