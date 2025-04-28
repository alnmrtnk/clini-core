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

    public class MedicalRecordRepository : IMedicalRecordRepository
    {
        private readonly AppDbContext _db;

        private readonly IMapper _map;

        public MedicalRecordRepository(AppDbContext db, IMapper map)
        {
            _db = db;
            _map = map;
        }

        public async Task<IEnumerable<MedicalRecordDto>> GetAllAsync() =>
            _map.Map<IEnumerable<MedicalRecordDto>>(await _db.MedicalRecords.ToListAsync());

        public async Task<MedicalRecordDto> GetByIdAsync(Guid id) =>
            _map.Map<MedicalRecordDto>(await _db.MedicalRecords.FindAsync(id));

        public async Task<Guid> AddAsync(CreateMedicalRecordDto dto)
        {
            var e = _map.Map<MedicalRecord>(dto);
            _db.MedicalRecords.Add(e);
            await _db.SaveChangesAsync();
            return e.Id;
        }

        public async Task UpdateAsync(Guid id, UpdateMedicalRecordDto dto)
        {
            var e = await _db.MedicalRecords.FindAsync(id);
            _map.Map(dto, e);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var e = await _db.MedicalRecords.FindAsync(id);

            if (e != null)
            {
                _db.MedicalRecords.Remove(e);
                await _db.SaveChangesAsync();
            }
        }
    }
}
