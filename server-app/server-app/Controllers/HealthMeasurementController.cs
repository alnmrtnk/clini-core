using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server_app.Dtos;
using server_app.Services;

namespace server_app.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class HealthMeasurementsController : ControllerBase
    {
        private readonly IHealthMeasurementService _s;

        public HealthMeasurementsController(IHealthMeasurementService s)
        {
            _s = s;
        }

        [HttpGet]
        public async Task<IActionResult> Get() => Ok(await _s.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id) => Ok(await _s.GetByIdAsync(id));

        [HttpPost]
        public async Task<IActionResult> Post(CreateHealthMeasurementDto d)
        {
            var id = await _s.CreateAsync(d);
            return CreatedAtAction(null, new { id }, null);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(Guid id, UpdateHealthMeasurementDto d)
        {
            await _s.UpdateAsync(id, d);
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
