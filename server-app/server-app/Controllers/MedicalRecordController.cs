using Microsoft.AspNetCore.Mvc;
using server_app.Dtos;
using server_app.Services;

namespace server_app.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicalRecordsController : ControllerBase
    {
        private readonly IMedicalRecordService _s;

        public MedicalRecordsController(IMedicalRecordService s)
        {
            _s = s;
        }

        [HttpGet]
        public async Task<IActionResult> Get() => Ok(await _s.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id) => Ok(await _s.GetByIdAsync(id));

        [HttpPost]
        public async Task<IActionResult> Post(CreateMedicalRecordDto d)
        {
            var id = await _s.CreateAsync(d);
            return CreatedAtAction(null, new { id }, null);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(Guid id, UpdateMedicalRecordDto d)
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
