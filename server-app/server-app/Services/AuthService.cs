using server_app.Dtos;
using server_app.Models;
using server_app.Repositories;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace server_app.Services
{
    public interface IAuthService
    {
        Task<Guid> RegisterAsync(RegisterDto dto);
        Task<AuthResponse> LoginAsync(LoginDto dto);
    }

    public class AuthService : IAuthService
    {
        private readonly IUserRepository _users;
        private readonly IConfiguration _config;

        public AuthService(IUserRepository users, IConfiguration config)
        {
            _users = users;
            _config = config;
        }

        public async Task<Guid> RegisterAsync(RegisterDto dto)
        {
            if (await _users.GetEntityByEmailAsync(dto.Email) != null)
                throw new InvalidOperationException("Email already in use.");
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var newId = await _users.AddAsync(new CreateUserDto
            {
                Email = dto.Email,
                Password = passwordHash,
                FullName = dto.FullName
            });
            return newId;
        }

        public async Task<AuthResponse> LoginAsync(LoginDto dto)
        {
            var userEntity = await _users.GetEntityByEmailAsync(dto.Email)
                             ?? throw new UnauthorizedAccessException("Invalid credentials.");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, userEntity.PasswordHash))
                throw new UnauthorizedAccessException("Invalid credentials.");

            var jwtConf = _config.GetSection("JwtSettings");
            var keyBytes = Encoding.UTF8.GetBytes(jwtConf["Key"]!);
            var key = new SymmetricSecurityKey(keyBytes);
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, userEntity.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, userEntity.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

            var token = new JwtSecurityToken(
                issuer: jwtConf["Issuer"],
                audience: jwtConf["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(double.Parse(jwtConf["ExpiresInMinutes"]!)),
                signingCredentials: creds
            );
            var tokenStr = new JwtSecurityTokenHandler().WriteToken(token);

            return new AuthResponse(tokenStr, userEntity.Id, userEntity.Email);
        }
    }
}
