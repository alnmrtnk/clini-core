namespace server_app.Dtos
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public DateTime DateOfBirth { get; set; }
        public string PhoneNumber { get; set; } = null!;
        public string? EsculabPatientId { get; set; }

        public string? EsculabPhoneNumber { get; set; }
    }

    public class CreateUserDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public DateTime DateOfBirth { get; set; }
        public string PhoneNumber { get; set; } = null!;
    }

    public class UpdateUserDto
    {
        public string FullName { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string? EsculabPatientId { get; set; }
        public string? EsculabPhoneNumber { get; set; }

    }
}
