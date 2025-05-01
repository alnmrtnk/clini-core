using Microsoft.AspNetCore.Mvc;
using server_app.Dtos;
using server_app.Helpers;
using server_app.Services;

namespace server_app.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _s;

        public UsersController(IUserService s)
        {
            _s = s;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _s.GetAllAsync();
            return this.ToActionResult(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var result = await _s.GetByIdAsync(id);
            return this.ToActionResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Post(CreateUserDto dto)
        {
            var result = await _s.CreateAsync(dto);
            if (result.Success)
                return CreatedAtAction(null, new { id = result.Data }, null);

            return this.ToActionResult(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(UpdateUserDto dto)
        {
            var result = await _s.UpdateAsync(dto);
            return this.ToActionResult(result);
        }
    }
}
