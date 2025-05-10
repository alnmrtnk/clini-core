using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server_app.Dtos;
using server_app.Helpers;
using server_app.Services;

namespace server_app.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorCommentController : ControllerBase
    {
        private readonly IDoctorCommentService _svc;

        public DoctorCommentController(IDoctorCommentService svc)
        {
            _svc = svc;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateDoctorCommentDto dto)
        {
            var result = await _svc.CreateAsync(dto);
            return this.ToActionResult(result);
        }

        [HttpGet("record/{medicalRecordId}")]
        public async Task<IActionResult> GetByRecord(Guid medicalRecordId)
        {
            var result = await _svc.GetByMedicalRecordAsync(medicalRecordId);
            return this.ToActionResult(result);
        }

        [HttpGet("types")]
        public async Task<IActionResult> GetTypes()
        {
            var result = await _svc.GetCommentTypesAsync();
            return this.ToActionResult(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] CreateDoctorCommentDto dto)
        {
            var result = await _svc.UpdateAsync(id, dto);
            return this.ToActionResult(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _svc.DeleteAsync(id);
            return this.ToActionResult(result);
        }
    }
}
