using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server_app.Helpers;
using server_app.Services;

namespace server_app.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class RecordTypesController : ControllerBase
    {
        private readonly IRecordTypeService _s;

        public RecordTypesController(IRecordTypeService s)
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
    }
}
