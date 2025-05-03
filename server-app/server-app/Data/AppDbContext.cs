using Microsoft.EntityFrameworkCore;
using server_app.Models;
using System;

namespace server_app.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> opts) : base(opts) { }

        public DbSet<User> Users { get; set; }
        public DbSet<MedicalRecord> MedicalRecords { get; set; }
        public DbSet<DoctorAccess> DoctorAccesses { get; set; }
        public DbSet<RecordType> RecordTypes { get; set; }

        public DbSet<MedicalRecordFile> MedicalRecordFiles { get; set; }


        protected override void OnModelCreating(ModelBuilder m)
        {
            base.OnModelCreating(m);

            m.Entity<User>(e => {
                e.HasKey(u => u.Id);
                e.HasIndex(u => u.Email).IsUnique();
                e.HasData(
                    new User
                    {
                        Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                        Email = "alice.smith@example.com",
                        PasswordHash = "$2a$11$uG8v.z01UXD2DzTCKFTZP.U2r3koECkfjZg0Nbh3b6p5z1LGCb5BW",
                        FullName = "Alice Smith",
                        DateOfBirth = new DateTime(1985, 5, 1, 0, 0, 0, DateTimeKind.Utc),
                        PhoneNumber = "+380501234567"
                    },
                    new User
                    {
                        Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                        Email = "bob.johnson@example.com",
                        PasswordHash = "$2a$11$uG8v.z01UXD2DzTCKFTZP.U2r3koECkfjZg0Nbh3b6p5z1LGCb5BW",
                        FullName = "Bob Johnson",
                        DateOfBirth = new DateTime(1990, 8, 15, 0, 0, 0, DateTimeKind.Utc),
                        PhoneNumber = "+380509876543"
                    },
                    new User
                    {
                        Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                        Email = "carol.williams@example.com",
                        PasswordHash = "$2a$11$uG8v.z01UXD2DzTCKFTZP.U2r3koECkfjZg0Nbh3b6p5z1LGCb5BW",
                        FullName = "Carol Williams",
                        DateOfBirth = new DateTime(1978, 2, 20, 0, 0, 0, DateTimeKind.Utc),     
                        PhoneNumber = "+380503456789"
                    },
                    new User
                    {
                        Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                        Email = "david.brown@example.com",
                        PasswordHash = "$2a$11$uG8v.z01UXD2DzTCKFTZP.U2r3koECkfjZg0Nbh3b6p5z1LGCb5BW",
                        FullName = "David Brown",
                        DateOfBirth = new DateTime(2000, 11, 30, 0, 0, 0, DateTimeKind.Utc),
                        PhoneNumber = "+380507654321"
                    }
                );
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

                e.HasData(
                    new MedicalRecord
                    {
                        Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                        UserId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                        RecordTypeId = recordTypeReport,
                        Title = "Complete Blood Count",
                        Date = new DateTime(2024, 1, 10, 0, 0, 0, DateTimeKind.Utc)
                    },
                    new MedicalRecord
                    {
                        Id = Guid.Parse("66666666-6666-6666-6666-666666666666"),
                        UserId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                        RecordTypeId = recordTypeImage,
                        Title = "Chest X-Ray",
                        Date = new DateTime(2024, 2, 5, 0, 0, 0, DateTimeKind.Utc)
                    },
                    new MedicalRecord
                    {
                        Id = Guid.Parse("77777777-7777-7777-7777-777777777777"),
                        UserId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                        RecordTypeId = recordTypeForm,
                        Title = "Dermatology Consultation",
                        Date = new DateTime(2024, 3, 12, 0, 0, 0, DateTimeKind.Utc)
                    },
                    new MedicalRecord
                    {
                        Id = Guid.Parse("88888888-8888-8888-8888-888888888888"),
                        UserId = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                        RecordTypeId = recordTypePrescription,
                        Title = "Blood Pressure Medication",
                        Date = new DateTime(2024, 3, 20, 0, 0, 0, DateTimeKind.Utc)
                    },
                    new MedicalRecord
                    {
                        Id = Guid.Parse("99999999-9999-9999-9999-999999999999"),
                        UserId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                        RecordTypeId = recordTypeForm,
                        Title = "Appendectomy",
                        Date = new DateTime(2023, 12, 1, 0, 0, 0, DateTimeKind.Utc)
                    }
                );
            });

            m.Entity<MedicalRecordFile>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasOne(x => x.MedicalRecord)
                    .WithMany(mr => mr.Files)
                    .HasForeignKey(x => x.MedicalRecordId);
            });


            m.Entity<DoctorAccess>(e => {
                e.HasKey(x => x.Id);

                e.HasOne(x => x.User)
                    .WithMany(u => u.DoctorAccesses)
                    .HasForeignKey(x => x.OwnerUserId);

                e.HasOne(x => x.SharedWithUser)
                .WithMany()
                .HasForeignKey(x => x.TargetUserId);

                e.HasData(
                    new DoctorAccess
                    {
                        Id = Guid.Parse("12345678-1234-1234-1234-1234567890ab"),
                        OwnerUserId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                        Name = "Dr. Gregory House",
                        GrantedAt = new DateTime(2024, 4, 15, 0, 0, 0, DateTimeKind.Utc),
                        ExpiresAt = new DateTime(2024, 5, 15, 0, 0, 0, DateTimeKind.Utc)
                    },
                    new DoctorAccess
                    {
                        Id = Guid.Parse("87654321-4321-4321-4321-ba0987654321"),
                        OwnerUserId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                        Name = "Dr. Meredith Grey",
                        GrantedAt = new DateTime(2024, 3, 1, 0, 0, 0, DateTimeKind.Utc),
                        ExpiresAt = new DateTime(2024, 4, 1, 0, 0, 0, DateTimeKind.Utc)
                    }
                );
            });
        }
    }
}
