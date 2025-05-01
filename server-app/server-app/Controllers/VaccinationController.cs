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
    public class VaccinationsController : ControllerBase
    {
        private readonly IVaccinationService _s;

        public VaccinationsController(IVaccinationService s)
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
        public async Task<IActionResult> Post(CreateVaccinationDto d)
        {
            var result = await _s.CreateAsync(d);
            if (result.Success)
                return CreatedAtAction(null, new { id = result.Data }, null);

            return this.ToActionResult(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(Guid id, UpdateVaccinationDto d)
        {
            var result = await _s.UpdateAsync(id, d);
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
