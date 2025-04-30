using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server_app.Data;
using server_app.Dtos;
using server_app.Models;

namespace server_app.Repositories
{
    public interface IMedicalRecordRepository
    {
        Task<IEnumerable<MedicalRecordDto>> GetAllAsync();
        Task<MedicalRecordDto> GetByIdAsync(Guid id);
        Task<Guid> AddAsync(CreateMedicalRecordDto dto);
        Task UpdateAsync(Guid id, UpdateMedicalRecordDto dto);
        Task DeleteAsync(Guid id);
    }

    public class MedicalRecordRepository : BaseRepository, IMedicalRecordRepository
    {
        private readonly AppDbContext _db;
        private readonly IMapper _map;

        public MedicalRecordRepository(AppDbContext db, IMapper map, IHttpContextAccessor accessor)
            : base(accessor)
        {
            _db = db;
            _map = map;
        }

        public async Task<IEnumerable<MedicalRecordDto>> GetAllAsync() =>
            _map.Map<IEnumerable<MedicalRecordDto>>(
                await _db.MedicalRecords
                    .Where(x => x.UserId == CurrentUserId)
                    .ToListAsync()
            );

        public async Task<MedicalRecordDto> GetByIdAsync(Guid id) =>
            _map.Map<MedicalRecordDto>(
                await _db.MedicalRecords
                    .FirstOrDefaultAsync(x => x.Id == id && x.UserId == CurrentUserId)
            );

        public async Task<Guid> AddAsync(CreateMedicalRecordDto dto)
        {
            var entity = _map.Map<MedicalRecord>(dto);
            entity.UserId = CurrentUserId;
            _db.MedicalRecords.Add(entity);
            await _db.SaveChangesAsync();
            return entity.Id;
        }

        public async Task UpdateAsync(Guid id, UpdateMedicalRecordDto dto)
        {
            var entity = await _db.MedicalRecords
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == CurrentUserId);

            if (entity == null)
                throw new UnauthorizedAccessException("Access denied or record not found.");

            _map.Map(dto, entity);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await _db.MedicalRecords
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == CurrentUserId);

            if (entity != null)
            {
                _db.MedicalRecords.Remove(entity);
                await _db.SaveChangesAsync();
            }
        }
    }
}
