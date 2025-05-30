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
    public class MedicalRecordsController : ControllerBase
    {
        private readonly IMedicalRecordService _s;

        public MedicalRecordsController(IMedicalRecordService s)
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
        public async Task<IActionResult> Post([FromForm] CreateMedicalRecordDto dto, [FromForm] List<IFormFile> files)
        {
            var result = await _s.CreateAsync(dto, files);
            if (result.Success)
                return CreatedAtAction(null, new { id = result.Data }, null);

            return this.ToActionResult(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(
            Guid id,
            [FromForm] UpdateMedicalRecordDto dto,
            [FromForm] List<IFormFile> files
        )
        {
            var result = await _s.UpdateAsync(id, dto, files);
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
