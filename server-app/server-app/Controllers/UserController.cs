using Microsoft.AspNetCore.Mvc;
using server_app.Dtos;
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
        public async Task<IActionResult> Get() => Ok(await _s.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id) => Ok(await _s.GetByIdAsync(id));

        [HttpPost]
        public async Task<IActionResult> Post(CreateUserDto dto)
        {
            var id = await _s.CreateAsync(dto);
            return CreatedAtAction(null, new { id }, null);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(Guid id, UpdateUserDto dto)
        {
            await _s.UpdateAsync(id, dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _s.DeleteAsync(id);
            return NoContent();
        }
    }
}
