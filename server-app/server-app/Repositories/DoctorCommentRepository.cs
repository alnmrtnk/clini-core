using Microsoft.EntityFrameworkCore;
using server_app.Data;
using server_app.Models;

namespace server_app.Repositories
{
    public interface IDoctorCommentRepository
    {
        Task<Guid> AddAsync(DoctorComment comment);
        Task<IEnumerable<DoctorComment>> GetByMedicalRecordIdAsync(Guid medicalRecordId);
        Task<DoctorComment?> GetByIdAsync(Guid id);
        Task UpdateAsync(DoctorComment comment);
        Task DeleteAsync(DoctorComment comment);
        Task<IEnumerable<DoctorCommentType>> GetCommentTypesAsync();
    }

    public class DoctorCommentRepository : IDoctorCommentRepository
    {
        private readonly AppDbContext _context;

        public DoctorCommentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> AddAsync(DoctorComment comment)
        {
            _context.DoctorComments.Add(comment);
            await _context.SaveChangesAsync();
            return comment.Id;
        }

        public async Task<IEnumerable<DoctorComment>> GetByMedicalRecordIdAsync(Guid medicalRecordId)
        {
            return await _context.DoctorComments
                .Include(c => c.DoctorCommentType)
                .Where(c => c.MedicalRecordId == medicalRecordId)
                .OrderBy(c => c.Date)
                .ToListAsync();
        }

        public async Task<DoctorComment?> GetByIdAsync(Guid id)
            => await _context.DoctorComments.FindAsync(id);

        public async Task UpdateAsync(DoctorComment comment)
        {
            _context.DoctorComments.Update(comment);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(DoctorComment comment)
        {
            _context.DoctorComments.Remove(comment);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<DoctorCommentType>> GetCommentTypesAsync()
            => await _context.Set<DoctorCommentType>().ToListAsync();
    }
}
