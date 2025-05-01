using server_app.Extensions;

namespace server_app.Repositories
{
    public abstract class BaseRepository
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        protected BaseRepository(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        protected Guid CurrentUserId =>
            _httpContextAccessor.HttpContext?.User.GetUserId()
            ?? throw new UnauthorizedAccessException("User ID not found in token.");
    }
}
