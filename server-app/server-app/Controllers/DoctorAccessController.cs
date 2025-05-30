using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server_app.Dtos;
using server_app.Extensions;
using server_app.Helpers;
using server_app.Services;

namespace server_app.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorAccessController : ControllerBase
    {
        private readonly IDoctorAccessService _svc;

        public DoctorAccessController(IDoctorAccessService svc)
        {
            _svc = svc;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateDoctorAccessDto dto)
        {
            var result = await _svc.CreateAsync(dto);
            return this.ToActionResult(result);
        }

        [Authorize]
        [HttpGet("shared-with-me")]
        public async Task<IActionResult> GetSharedWithMe()
        {
            var userId = User.GetUserId();
            var result = await _svc.GetAccessibleRecordsAsync(userId, null);
            return this.ToActionResult(result);
        }

        [HttpGet("public/{token}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSharedPublic(string token)
        {
            var result = await _svc.GetAccessibleRecordsAsync(null, token);
            return this.ToActionResult(result);
        }

        [Authorize]
        [HttpGet("granted")]
        public async Task<IActionResult> GetGrantedAccesses()
        {
            var result = await _svc.GetGrantedAccessesAsync();
            return this.ToActionResult(result);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Revoke(Guid id)
        {
            var result = await _svc.RevokeAsync(id);
            return this.ToActionResult(result);
        }
    }
}
