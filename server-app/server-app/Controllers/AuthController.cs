using Microsoft.AspNetCore.Mvc;
using server_app.Dtos;
using server_app.Helpers;
using server_app.Services;

namespace server_app.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _auth;

        public AuthController(IAuthService auth)
        {
            _auth = auth;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var result = await _auth.RegisterAsync(dto);
            if (result.Success)
                return CreatedAtAction(null, new { id = result.Data });

            return this.ToActionResult(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var result = await _auth.LoginAsync(dto);
            return this.ToActionResult(result);
        }
    }
}
