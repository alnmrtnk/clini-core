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
        Task<IEnumerable<MedicalRecordDto>> GetByUserIdsAsync(List<Guid> userId);
        Task<Guid> AddAsync(CreateMedicalRecordDto dto);
        Task<bool> UpdateAsync(Guid id, UpdateMedicalRecordDto dto);
        Task<bool> DeleteAsync(Guid id);
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
                    .Include(x => x.Files)
                    .Include(x => x.RecordType)
                    .Include(x => x.DoctorComments).ThenInclude(y => y.DoctorAccess)
                    .Include(x => x.DoctorComments).ThenInclude(y => y.DoctorCommentType)
                    .Where(x => x.UserId == CurrentUserId)
                    .ToListAsync()
            );

        public async Task<MedicalRecordDto> GetByIdAsync(Guid id) =>
            _map.Map<MedicalRecordDto>(
                await _db.MedicalRecords
                    .Include(x => x.Files)
                    .Include(x => x.RecordType)
                    .Include(x => x.DoctorComments).ThenInclude(y => y.DoctorAccess)
                    .Include(x => x.DoctorComments).ThenInclude(y => y.DoctorCommentType)
                    .FirstOrDefaultAsync(x => x.Id == id && x.UserId == CurrentUserId)
            );

        public async Task<IEnumerable<MedicalRecordDto>> GetByUserIdsAsync(List<Guid> userIds) =>
            _map.Map<IEnumerable<MedicalRecordDto>>(
                await _db.MedicalRecords
                    .Include(x => x.Files)
                    .Include(x => x.RecordType)
                    .Include(x => x.DoctorComments).ThenInclude(y => y.DoctorAccess)
                    .Include(x => x.DoctorComments).ThenInclude(y => y.DoctorCommentType)
                    .Include(x => x.User)
                    .Where(x => userIds.Contains(x.UserId))
                    .ToListAsync()
            );

        public async Task<Guid> AddAsync(CreateMedicalRecordDto dto)
        {
            var entity = _map.Map<MedicalRecord>(dto);
            entity.UserId = CurrentUserId;
            _db.MedicalRecords.Add(entity);
            await _db.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<bool> UpdateAsync(Guid id, UpdateMedicalRecordDto dto)
        {
            var entity = await _db.MedicalRecords
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == CurrentUserId);

            if (entity == null)
                return false;

            _map.Map(dto, entity);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _db.MedicalRecords
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == CurrentUserId);

            if (entity == null)
                return false;

            _db.MedicalRecords.Remove(entity);
            await _db.SaveChangesAsync();
            return true;
        }

    }
}
