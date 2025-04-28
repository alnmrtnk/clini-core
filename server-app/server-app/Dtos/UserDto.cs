namespace server_app.Dtos
{
    public class UserDto { public Guid Id; public string Email = null!; public string FullName = null!; }
    public class CreateUserDto { public string Email = null!; public string Password = null!; public string FullName = null!; public DateTime DateOfBirth; public string PhoneNumber = null!; }
    public class UpdateUserDto { public string FullName = null!; public string PhoneNumber = null!; }
}
