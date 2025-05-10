using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using server_app.Dtos;
using server_app.Helpers;
using server_app.Repositories;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace server_app.Services
{
    public interface IAuthService
    {
        Task<ServiceResult<Guid>> RegisterAsync(RegisterDto dto);
        Task<ServiceResult<AuthResponse>> LoginAsync(LoginDto dto);
        ServiceResult<ClaimsPrincipal> ValidateToken(string? token = null);
    }

    public class AuthService : IAuthService
    {
        private readonly IUserRepository _users;
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpCtx;

        public AuthService(
            IUserRepository users,
            IConfiguration config,
            IHttpContextAccessor httpContextAccessor)
        {
            _users = users;
            _config = config;
            _httpCtx = httpContextAccessor;
        }

        public async Task<ServiceResult<Guid>> RegisterAsync(RegisterDto dto)
        {
            if (await _users.GetEntityByEmailAsync(dto.Email) != null)
                return ServiceResult<Guid>.Fail("Email already in use.", StatusCodes.Status409Conflict);

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            var newId = await _users.AddAsync(new CreateUserDto
            {
                Email = dto.Email,
                Password = passwordHash,
                FullName = dto.FullName
            });

            return ServiceResult<Guid>.Ok(newId);
        }

        public async Task<ServiceResult<AuthResponse>> LoginAsync(LoginDto dto)
        {
            var user = await _users.GetEntityByEmailAsync(dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return ServiceResult<AuthResponse>.Fail("Invalid credentials.", StatusCodes.Status401Unauthorized);

            var jwtConf = _config.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConf["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
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
            return ServiceResult<AuthResponse>.Ok(new AuthResponse(tokenStr, user.Id, user.Email));
        }

        public ServiceResult<ClaimsPrincipal> ValidateToken(string? token = null)
        {
            // 1) if caller didn’t pass a token, pull it from Header
            if (string.IsNullOrWhiteSpace(token))
            {
                var hdr = _httpCtx.HttpContext?
                            .Request
                            .Headers["Authorization"]
                            .FirstOrDefault();
                if (string.IsNullOrEmpty(hdr) || !hdr.StartsWith("Bearer "))
                    return ServiceResult<ClaimsPrincipal>
                        .Fail("Missing or malformed Authorization header.",
                              StatusCodes.Status400BadRequest);

                token = hdr["Bearer ".Length..].Trim();
            }

            // 2) build validation
            var jwtConf = _config.GetSection("JwtSettings");
            var key = Encoding.UTF8.GetBytes(jwtConf["Key"]!);
            var handler = new JwtSecurityTokenHandler();
            var parms = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = jwtConf["Issuer"],
                ValidateAudience = true,
                ValidAudience = jwtConf["Audience"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            try
            {
                var principal = handler.ValidateToken(token, parms, out var validatedToken);

                // extra-safety: only accept HMAC-SHA256
                if (validatedToken is JwtSecurityToken jwt &&
                    !jwt.Header.Alg.Equals(SecurityAlgorithms.HmacSha256,
                                           StringComparison.OrdinalIgnoreCase))
                {
                    return ServiceResult<ClaimsPrincipal>
                        .Fail("Invalid token algorithm.",
                              StatusCodes.Status401Unauthorized);
                }

                return ServiceResult<ClaimsPrincipal>.Ok(principal);
            }
            catch (SecurityTokenExpiredException)
            {
                return ServiceResult<ClaimsPrincipal>
                    .Fail("Token has expired.", StatusCodes.Status401Unauthorized);
            }
            catch (Exception ex)
            {
                return ServiceResult<ClaimsPrincipal>
                    .Fail($"Token validation failed: {ex.Message}",
                          StatusCodes.Status401Unauthorized);
            }
        }
    }
}
