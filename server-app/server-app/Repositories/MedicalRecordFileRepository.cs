using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server_app.Data;
using server_app.Dtos;
using server_app.Models;

namespace server_app.Repositories
{
    public interface IMedicalRecordFileRepository
    {
        Task<Guid> AddAsync(CreateMedicalRecordFileDto dto);
        Task<bool> DeleteAsync(Guid id);
    }

    public class MedicalRecordFileRepository : BaseRepository, IMedicalRecordFileRepository
    {
        private readonly AppDbContext _db;
        private readonly IMapper _map;

        public MedicalRecordFileRepository(AppDbContext db, IMapper map, IHttpContextAccessor accessor) : base(accessor) {
            _db = db;
            _map = map;
        }

        public async Task<Guid> AddAsync(CreateMedicalRecordFileDto dto)
        {
            var entity = _map.Map<MedicalRecordFile>(dto);
            _db.MedicalRecordFiles.Add(entity);
            await _db.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var file = await _db.MedicalRecordFiles.FindAsync(id);
            if (file == null)
                return false;

            _db.MedicalRecordFiles.Remove(file);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
