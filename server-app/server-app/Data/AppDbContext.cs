using Microsoft.EntityFrameworkCore;
using server_app.Models;

namespace server_app.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Patient> Patients { get; set; }
        public DbSet<MedicalStaff> MedicalStaff { get; set; }
        public DbSet<Position> Positions { get; set; }
        public DbSet<Vaccination> Vaccinations { get; set; }
        public DbSet<Diagnose> Diagnoses { get; set; }
        public DbSet<MedicalRecord> MedicalRecords { get; set; }
        public DbSet<Allergy> Allergies { get; set; }
        public DbSet<MedicalConclusion> MedicalConclusions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Patient>()
                .Property(p => p.Gender)
                .HasConversion<int>();

            modelBuilder.Entity<Patient>()
                .Property(p => p.BloodType)
                .HasConversion<int>();

            modelBuilder.Entity<MedicalStaff>()
                .HasOne(ms => ms.Position)
                .WithMany()
                .HasForeignKey(ms => ms.PositionId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Vaccination>()
               .HasOne(v => v.Patient)
               .WithMany()
               .HasForeignKey(v => v.PatientId)
               .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Vaccination>()
                .HasOne(v => v.MedicalStaff)
                .WithMany()
                .HasForeignKey(v => v.MedicalStaffId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Diagnose>()
                .Property(d => d.Status)
                .HasConversion<int>();

            modelBuilder.Entity<Diagnose>()
               .HasOne(v => v.Patient)
               .WithMany()
               .HasForeignKey(v => v.PatientId)
               .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Diagnose>()
                .HasOne(v => v.MedicalStaff)
                .WithMany()
                .HasForeignKey(v => v.MedicalStaffId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<MedicalRecord>()
               .HasOne(v => v.Patient)
               .WithMany()
               .HasForeignKey(v => v.PatientId)
               .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<MedicalRecord>()
                .HasOne(v => v.MedicalStaff)
                .WithMany()
                .HasForeignKey(v => v.MedicalStaffId)
                .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<LabResult>()
               .HasOne(v => v.Patient)
               .WithMany()
               .HasForeignKey(v => v.PatientId)
               .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<LabResult>()
                .HasOne(v => v.MedicalStaff)
                .WithMany()
                .HasForeignKey(v => v.MedicalStaffId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Prescription>()
               .HasOne(v => v.Patient)
               .WithMany()
               .HasForeignKey(v => v.PatientId)
               .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Prescription>()
                .HasOne(v => v.MedicalStaff)
                .WithMany()
                .HasForeignKey(v => v.MedicalStaffId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Allergy>()
                .HasOne(v => v.Patient)
                .WithMany()
                .HasForeignKey(v => v.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<MedicalConclusion>()
                .HasOne(v => v.Patient)
                .WithMany()
                .HasForeignKey(v => v.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<MedicalConclusion>()
                .HasOne(v => v.MedicalStaff)
                .WithMany()
                .HasForeignKey(v => v.MedicalStaffId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PrescriptionLabResult>()
            .HasKey(plr => new { plr.PrescriptionId, plr.LabResultId });

            modelBuilder.Entity<PrescriptionLabResult>()
                .HasOne(plr => plr.Prescription)
                .WithMany(p => p.PrescriptionLabResults)
                .HasForeignKey(plr => plr.PrescriptionId);

            modelBuilder.Entity<PrescriptionLabResult>()
                .HasOne(plr => plr.LabResult)
                .WithMany()
                .HasForeignKey(plr => plr.LabResultId);
        }
    }
}
