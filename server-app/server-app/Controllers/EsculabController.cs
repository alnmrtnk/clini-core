using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server_app.Dtos.Esculab;
using server_app.Extensions;
using server_app.Helpers;
using server_app.Services;

namespace server_app.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class EsculabController : ControllerBase
    {
        private readonly IEsculabService _esculabService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public EsculabController(IEsculabService esculabService, IHttpContextAccessor httpContextAccessor)
        {
            _esculabService = esculabService;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost("authorize")]
        public async Task<IActionResult> AuthorizeEsculabUser([FromQuery] string phone)
        {
            var userId = _httpContextAccessor.HttpContext?.User.GetUserId()
                         ?? throw new UnauthorizedAccessException("User ID not found in token.");

            var result = await _esculabService.RequestCode(phone);
            return this.ToActionResult(result);
        }

        [HttpPost("accept-token")]
        public async Task<IActionResult> AcceptEsculabToken([FromQuery] string code, [FromQuery] string uuid)
        {
            var request = new AcceptTokenRequestDto
            {
                Code = code,
                Uuid = uuid
            };

            var result = await _esculabService.AcceptToken(request);
            return this.ToActionResult(result);
        }

        [HttpGet("find-patient")]
        public async Task<IActionResult> FindEsculabPatient([FromQuery] string esculabToken)
        {
            var result = await _esculabService.FindEsculabPatient(esculabToken);
            return this.ToActionResult(result);
        }

        [HttpGet("get-all-orders")]
        public async Task<IActionResult> GetAllEsculabOrders([FromQuery] string esculabToken)
        {
            var result = await _esculabService.GetEsculabOrders(esculabToken);
            return this.ToActionResult(result);
        }

        [HttpGet("get-order/{id}")]
        public async Task<IActionResult> GetSpecificOrder([FromRoute] int id, [FromQuery] string esculabToken)
        {
            var result = await _esculabService.GetSpecificEsculabOrder(id, esculabToken);
            return this.ToActionResult(result);
        }
    }
}
