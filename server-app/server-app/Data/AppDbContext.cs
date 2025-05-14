using Microsoft.EntityFrameworkCore;
using server_app.Models;

namespace server_app.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> opts) : base(opts) { }

        public DbSet<User> Users { get; set; }
        public DbSet<MedicalRecord> MedicalRecords { get; set; }
        public DbSet<Vaccination> Vaccinations { get; set; }
        public DbSet<HealthMeasurement> HealthMeasurements { get; set; }
        public DbSet<DoctorAccess> DoctorAccesses { get; set; }
        public DbSet<RecordType> RecordTypes { get; set; }
        public DbSet<MedicalRecordFile> MedicalRecordFiles { get; set; }
        public DbSet<DoctorComment> DoctorComments { get; set; }
        public DbSet<DoctorCommentType> DoctorCommentTypes { get; set; }


        protected override void OnModelCreating(ModelBuilder m)
        {
            base.OnModelCreating(m);

            m.Entity<User>(e => {
                e.HasKey(u => u.Id);
                e.HasIndex(u => u.Email).IsUnique();
            });

            var recordTypeReport = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
            var recordTypeImage = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
            var recordTypePrescription = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc");
            var recordTypeForm = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd");

            m.Entity<RecordType>(e => {
                e.HasKey(rt => rt.Id);
                e.HasData(
                    new RecordType { Id = recordTypeReport, Name = "report" },
                    new RecordType { Id = recordTypeImage, Name = "image" },
                    new RecordType { Id = recordTypePrescription, Name = "prescription" },
                    new RecordType { Id = recordTypeForm, Name = "form" }
                );
            });

            m.Entity<MedicalRecord>(e => {
                e.HasKey(x => x.Id);
                e.HasOne(x => x.User)
                    .WithMany(u => u.MedicalRecords)
                    .HasForeignKey(x => x.UserId);

                e.HasOne(x => x.RecordType)
                    .WithMany(rt => rt.MedicalRecords)
                    .HasForeignKey(x => x.RecordTypeId);
            });

            m.Entity<MedicalRecordFile>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasOne(x => x.MedicalRecord)
                    .WithMany(mr => mr.Files)
                    .HasForeignKey(x => x.MedicalRecordId);
            });


            m.Entity<Vaccination>(e => {
                e.HasKey(x => x.Id);
                e.HasOne(x => x.User)
                 .WithMany(u => u.Vaccinations)
                 .HasForeignKey(x => x.UserId);
                e.HasData(
                    new Vaccination
                    {
                        Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                        UserId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                        VaccineName = "COVID-19",
                        DoseNumber = 2,
                        DateAdministered = new DateTime(2023, 12, 10, 0, 0, 0, DateTimeKind.Utc)
                    },
                    new Vaccination
                    {
                        Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                        UserId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                        VaccineName = "Influenza",
                        DoseNumber = 1,
                        DateAdministered = new DateTime(2023, 10, 1, 0, 0, 0, DateTimeKind.Utc)
                    },
                    new Vaccination
                    {
                        Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                        UserId = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                        VaccineName = "Hepatitis B",
                        DoseNumber = 3,
                        DateAdministered = new DateTime(2023, 9, 15, 0, 0, 0, DateTimeKind.Utc)
                    },
                    new Vaccination
                    {
                        Id = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                        UserId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                        VaccineName = "Tetanus",
                        DoseNumber = 1,
                        DateAdministered = new DateTime(2023, 8, 5, 0, 0, 0, DateTimeKind.Utc)
                    }
                );
            });

            m.Entity<HealthMeasurement>(e => {
                e.HasKey(x => x.Id);
                e.HasOne(x => x.User)
                 .WithMany(u => u.HealthMeasurements)
                 .HasForeignKey(x => x.UserId);

                e.HasData(
                  new HealthMeasurement
                  {
                      Id = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"),
                      UserId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                      MeasurementType = "BloodPressure",
                      Value = "118/76",
                      MeasuredAt = new DateTime(2024, 4, 1, 0, 0, 0, DateTimeKind.Utc)
                  },
                  new HealthMeasurement
                  {
                      Id = Guid.Parse("ffffffff-ffff-ffff-ffff-ffffffffffff"),
                      UserId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                      MeasurementType = "BloodSugar",
                      Value = "5.4 mmol/L",
                      MeasuredAt = new DateTime(2024, 4, 2, 0, 0, 0, DateTimeKind.Utc)
                  },
                  new HealthMeasurement
                  {
                      // ← this must not be Guid.Empty
                      Id = Guid.Parse("abcdefab-cdef-abcd-efab-cdefabcdefab"),
                      UserId = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                      MeasurementType = "Weight",
                      Value = "68 kg",
                      MeasuredAt = new DateTime(2024, 4, 3, 0, 0, 0, DateTimeKind.Utc)
                  }
                );
            });

            // Seed DoctorAccess
            m.Entity<DoctorAccess>(e => {
                e.HasKey(x => x.Id);

                e.HasOne(x => x.User)
                    .WithMany(u => u.DoctorAccesses)
                    .HasForeignKey(x => x.OwnerUserId);

                e.HasOne(x => x.SharedWithUser)
                .WithMany()
                .HasForeignKey(x => x.TargetUserId);
            });

            var commentTypePrescription = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
            var commentTypeReccomendations = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
            var commentTypeComment = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc");

            m.Entity<DoctorCommentType>(e => {
                e.HasKey(dc => dc.Id);
                e.HasData(
                    new DoctorCommentType { Id = commentTypePrescription, Name = "prescription" },
                    new DoctorCommentType { Id = commentTypeReccomendations, Name = "reccomendations" },
                    new DoctorCommentType { Id = commentTypeComment, Name = "comment" }
                );
            });


            m.Entity<DoctorComment>(e => {
                e.HasKey(x => x.Id);
                e.HasOne(x => x.DoctorAccess)
                    .WithMany(da => da.DoctorComments)
                    .HasForeignKey(x => x.DoctorAccessId);

                e.HasOne(x => x.MedicalRecord)
                    .WithMany(mr => mr.DoctorComments)
                    .HasForeignKey(x => x.MedicalRecordId);

                e.HasOne(x => x.DoctorCommentType)
                    .WithMany(dc => dc.DoctorComments)
                    .HasForeignKey(x => x.DoctorCommentTypeId);
            });
        }
    }
}
