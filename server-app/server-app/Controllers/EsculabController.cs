using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server_app.Dtos.Esculab;
using server_app.Extensions;
using server_app.Helpers;
using server_app.Models;
using server_app.Repositories;
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
        private readonly IEsculabRepository _esculabRepo;

        public EsculabController(IEsculabService esculabService, IHttpContextAccessor httpContextAccessor, IEsculabRepository esculab)
        {
            _esculabService = esculabService;
            _httpContextAccessor = httpContextAccessor;
            _esculabRepo = esculab;
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
        public async Task<IActionResult> GetAllEsculabOrders([FromQuery] string? esculabToken)
        {
            if (string.IsNullOrWhiteSpace(esculabToken))
            {
                var localRecords = await _esculabRepo.GetAllAsync();
                return Ok(localRecords);
            }

            var result = await _esculabService.GetEsculabOrders(esculabToken);
            return this.ToActionResult(result);
        }

        [HttpGet("get-order/{orderId}")]
        public async Task<IActionResult> GetSpecificOrder(
        [FromRoute] int orderId,
        [FromQuery] string? esculabToken
    )
        {
            var allLocal = await _esculabRepo.GetAllAsync();
            var found = allLocal.FirstOrDefault(x => x.IdOrder == orderId);
            if (found != null && found.EsculabRecordDetails.Any())
            {
                return Ok(found);
            }

            if (string.IsNullOrWhiteSpace(esculabToken))
            {
                return NotFound("No local copy and no Esculab token provided.");
            }

            var detResult = await _esculabService.GetSpecificEsculabOrder(orderId, esculabToken);
            if (!detResult.Success || detResult.Data == null)
                return this.ToActionResult(detResult);

            var user = await ((EsculabService)_esculabService)._userRepository.GetCurrentUser();
            var detailEntities = new List<EsculabRecordDetails>();
            foreach (var dto in detResult.Data)
            {
                var detEntity = ((EsculabService)_esculabService)
                                     ._mapper.Map<EsculabRecordDetails>(dto);
                detEntity.DetailsId = Guid.NewGuid();
                detEntity.EsculabRecordId = found?.Id ?? throw new InvalidOperationException();
                detailEntities.Add(detEntity);
            }
            await _esculabRepo.AddOrUpdateRecordDetailsAsync(detailEntities);

            var reloaded = (await _esculabRepo.GetAllAsync())
                             .First(x => x.IdOrder == orderId);
            return Ok(reloaded);
        }
    }
}
