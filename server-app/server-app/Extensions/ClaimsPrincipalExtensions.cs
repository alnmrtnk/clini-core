using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace server_app.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static Guid? GetUserId(this ClaimsPrincipal user)
        {
            var idStr = user.FindFirstValue(JwtRegisteredClaimNames.Sub)
                     ?? user.FindFirstValue(ClaimTypes.NameIdentifier);

            return Guid.TryParse(idStr, out var id) ? id : null;
        }
    }
}
