using Microsoft.AspNetCore.Mvc;
using server_app.Dtos;
using server_app.Services;

namespace server_app.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorAccessController : ControllerBase
    {
        private readonly IDoctorAccessService _s;

        public DoctorAccessController(IDoctorAccessService s)
        {
            _s = s;
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(Guid userId) =>
            Ok(await _s.GetByUserIdAsync(userId));

        [HttpPost]
        public async Task<IActionResult> Post(CreateDoctorAccessDto d)
        {
            var id = await _s.CreateAsync(d);
            return CreatedAtAction(null, new { id }, null);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _s.DeleteAsync(id);
            return NoContent();
        }
    }
}
