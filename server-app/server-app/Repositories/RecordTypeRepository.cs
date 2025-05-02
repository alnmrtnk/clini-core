using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server_app.Data;
using server_app.Dtos;

namespace server_app.Repositories
{
    public interface IRecordTypeRepository
    {
        Task<IEnumerable<RecordTypeDto>> GetAllAsync();
        Task<RecordTypeDto?> GetByIdAsync(Guid id);
    }

    public class RecordTypeRepository : IRecordTypeRepository
    {
        private readonly AppDbContext _db;
        private readonly IMapper _map;

        public RecordTypeRepository(AppDbContext db, IMapper map)
        {
            _db = db;
            _map = map;
        }

        public async Task<IEnumerable<RecordTypeDto>> GetAllAsync()
        {
            var types = await _db.RecordTypes.ToListAsync();
            return _map.Map<IEnumerable<RecordTypeDto>>(types);
        }

        public async Task<RecordTypeDto?> GetByIdAsync(Guid id)
        {
            var type = await _db.RecordTypes.FindAsync(id);
            return _map.Map<RecordTypeDto?>(type);
        }
    }
}
