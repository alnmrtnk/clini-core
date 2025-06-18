using Microsoft.EntityFrameworkCore;
using server_app.Data;
using server_app.Models;

namespace server_app.Repositories
{
    public interface IEsculabRepository
    {
        Task<IEnumerable<EsculabRecord>> GetAllAsync();
        Task AddOrUpdateOrdersAsync(IEnumerable<EsculabRecord> orders);
        Task AddOrUpdateRecordDetailsAsync(IEnumerable<EsculabRecordDetails> details);

        Task<IEnumerable<EsculabRecord>> GetByUserIdsAsync(List<Guid> userIds);
    }
    public class EsculabRepository : BaseRepository, IEsculabRepository
    {
        private readonly AppDbContext _db;

        public EsculabRepository(AppDbContext db, IHttpContextAccessor accessor): base(accessor)
        {
            _db = db;
        }

        public async Task<IEnumerable<EsculabRecord>> GetAllAsync()
        {
            return await _db.EsculabRecords
                            .Include(r => r.EsculabRecordDetails)
                            .Include(r => r.DoctorComments).ThenInclude(c => c.DoctorAccess)
                            .Include(r => r.DoctorComments).ThenInclude(c => c.DoctorCommentType)
                            .Where(x => x.UserId == CurrentUserId)
                            .ToListAsync();
        }

        public async Task<IEnumerable<EsculabRecord>> GetByUserIdsAsync(List<Guid> userIds)
        {
            return await _db.EsculabRecords
                            .Include(r => r.EsculabRecordDetails)
                            .Include(r => r.DoctorComments).ThenInclude(c => c.DoctorAccess)
                            .Include(r => r.DoctorComments).ThenInclude(c => c.DoctorCommentType)
                            .Where(x => userIds.Contains(x.UserId))
                            .ToListAsync();
        }

        public async Task AddOrUpdateOrdersAsync(IEnumerable<EsculabRecord> orders)
        {
            foreach (var order in orders)
            {
                var existing = await _db.EsculabRecords
                                        .FirstOrDefaultAsync(x => x.IdOrder == order.IdOrder && x.UserId == CurrentUserId);
                if (existing == null)
                {
                    order.Id = Guid.NewGuid();
                    _db.EsculabRecords.Add(order);
                }
                else
                {
                    order.Id = existing.Id;
                    order.UserId = existing.UserId;
                    _db.Entry(existing).CurrentValues.SetValues(order);
                }
            }
            await _db.SaveChangesAsync();
        }

        public async Task AddOrUpdateRecordDetailsAsync(IEnumerable<EsculabRecordDetails> details)
        {
            foreach (var det in details)
            {
                var existing = await _db.EsculabRecordDetails
                                        .FirstOrDefaultAsync(x => x.id == det.id && x.EsculabRecordId == det.EsculabRecordId);
                if (existing == null)
                {
                    _db.EsculabRecordDetails.Add(det);
                }
                else
                {
                    det.DetailsId = existing.DetailsId;
                    _db.Entry(existing).CurrentValues.SetValues(det);
                }
            }
            await _db.SaveChangesAsync();
        }
    }
}
