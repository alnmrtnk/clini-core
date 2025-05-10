namespace server_app.Dtos
{
    public class UserDto
    {
        public required Guid Id { get; set; }
        public required string Email { get; set; } = null!;
        public required string FullName { get; set; } = null!;
        public DateTime? DateOfBirth { get; set; }
        public string? PhoneNumber { get; set; } = null!;
        public string? EsculabPatientId { get; set; } = null!;
        public string? EsculabPhoneNumber { get; set; } = null!;
    }

    public class CreateUserDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string FullName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? PhoneNumber { get; set; } = null!;
    }

    public class UpdateUserDto
    {
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? EsculabPatientId { get; set; }
        public string? EsculabPhoneNumber { get; set; }

    }
}
