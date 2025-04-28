using Microsoft.EntityFrameworkCore;
using server_app.Models;

namespace server_app.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> opts)
            : base(opts) { }

        public DbSet<User> Users { get; set; }
        public DbSet<MedicalRecord> MedicalRecords { get; set; }
        public DbSet<Vaccination> Vaccinations { get; set; }
        public DbSet<HealthMeasurement> HealthMeasurements { get; set; }
        public DbSet<DoctorAccess> DoctorAccesses { get; set; }

        protected override void OnModelCreating(ModelBuilder m)
        {
            base.OnModelCreating(m);
            m.Entity<User>(e =>
            {
                e.HasKey(u => u.Id);
                e.HasIndex(u => u.Email).IsUnique();
            });
            m.Entity<MedicalRecord>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasOne(x => x.User).WithMany(u => u.MedicalRecords).HasForeignKey(x => x.UserId);
            });
            m.Entity<Vaccination>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasOne(x => x.User).WithMany(u => u.Vaccinations).HasForeignKey(x => x.UserId);
            });
            m.Entity<HealthMeasurement>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasOne(x => x.User)
                    .WithMany(u => u.HealthMeasurements)
                    .HasForeignKey(x => x.UserId);
            });
            m.Entity<DoctorAccess>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasOne(x => x.User).WithMany(u => u.DoctorAccesses).HasForeignKey(x => x.UserId);
            });
        }
    }
}
