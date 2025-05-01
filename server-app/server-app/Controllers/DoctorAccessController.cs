using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server_app.Dtos;
using server_app.Helpers;
using server_app.Services;

namespace server_app.Controllers
{
    [Authorize]
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
        public async Task<IActionResult> GetByUser(Guid userId)
        {
            var result = await _s.GetByUserIdAsync(userId);
            return this.ToActionResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Post(CreateDoctorAccessDto d)
        {
            var result = await _s.CreateAsync(d);
            if (result.Success)
                return CreatedAtAction(null, new { id = result.Data }, null);

            return this.ToActionResult(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _s.DeleteAsync(id);
            return this.ToActionResult(result);
        }
    }
}
