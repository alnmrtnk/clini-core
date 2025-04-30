using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server_app.Dtos;
using server_app.Services;

namespace server_app.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _auth;

        public AuthController(IAuthService auth) => _auth = auth;

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var userId = await _auth.RegisterAsync(dto);
            return CreatedAtAction(null, new { id = userId });
        }

        [HttpPost("login")]
        public async Task<AuthResponse> Login(LoginDto dto)
        {
            return await _auth.LoginAsync(dto);
        }
    }
}
