using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server_app.Data;
using server_app.Dtos;
using server_app.Models;

namespace server_app.Repositories
{
    public interface IDoctorAccessRepository
    {
        Task<Guid> AddAsync(DoctorAccess dto);
        Task<DoctorAccess?> GetByTokenAsync(string token);
        Task<DoctorAccess?> GetByUser(string? token);
        Task<IEnumerable<DoctorAccess>> GetValidAccessesForUserAsync(Guid userId);
        Task<IEnumerable<DoctorAccess>> GetValidAccessesByTokenAsync(string token);
        Task<IEnumerable<DoctorAccess>> GetGrantedAccessesByCurrentUserAsync();
        Task<bool> RevokeAsync(Guid id);

        Task<IEnumerable<DoctorAccess>> GetByTargetUserIdAsync(Guid targetUserId);
    }

    public class DoctorAccessRepository : BaseRepository, IDoctorAccessRepository
    {
        private readonly AppDbContext _context;
        private readonly IMapper _map;

        public DoctorAccessRepository(AppDbContext context, IHttpContextAccessor accessor, IMapper mapper)
            : base(accessor)
        {
            _context = context;
            _map = mapper;
        }

        public async Task<Guid> AddAsync(DoctorAccess dto)
        {
            dto.OwnerUserId = CurrentUserId;

            _context.DoctorAccesses.Add(dto);
            await _context.SaveChangesAsync();
            return dto.Id;
        }

        public async Task<DoctorAccess?> GetByUser(string? token)
        {
            try
            {
                var userId = CurrentUserId;
                return await _context.DoctorAccesses.FirstOrDefaultAsync(x => x.TargetUserId == userId && !x.Revoked && x.ExpiresAt > DateTime.UtcNow);
            }
            catch
            {
                return await _context.DoctorAccesses.FirstOrDefaultAsync(x => x.Token == token && !x.Revoked && x.ExpiresAt > DateTime.UtcNow);
            }
        }

        public async Task<DoctorAccess?> GetByTokenAsync(string token)
        {
            return await _context.DoctorAccesses.FirstOrDefaultAsync(x => x.Token == token);
        }

        public async Task<IEnumerable<DoctorAccess>> GetValidAccessesForUserAsync(Guid userId)
        {
            return await _context.DoctorAccesses
                .Where(x => x.TargetUserId == userId && !x.Revoked && x.ExpiresAt > DateTime.UtcNow)
                .ToListAsync();
        }

        public async Task<IEnumerable<DoctorAccess>> GetValidAccessesByTokenAsync(string token)
        {
            return await _context.DoctorAccesses
                .Where(x => x.Token == token && !x.Revoked && x.ExpiresAt > DateTime.UtcNow)
                .ToListAsync();
        }

        public async Task<IEnumerable<DoctorAccess>> GetGrantedAccessesByCurrentUserAsync()
        {
            return await _context.DoctorAccesses
                .Where(x => x.OwnerUserId == CurrentUserId)
                .OrderByDescending(x => x.GrantedAt)
                .ToListAsync();
        }

        public async Task<bool> RevokeAsync(Guid id)
        {
            var entity = await _context.DoctorAccesses.FirstOrDefaultAsync(x => x.Id == id && x.OwnerUserId == CurrentUserId);
            if (entity == null) return false;

            entity.Revoked = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<DoctorAccess>> GetByTargetUserIdAsync(Guid targetUserId)
        {
            return await _context.DoctorAccesses
                       .Where(a => a.TargetUserId == targetUserId && !a.Revoked)
                       .ToListAsync();
        }
    }
}
