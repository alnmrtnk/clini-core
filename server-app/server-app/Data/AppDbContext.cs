using Microsoft.EntityFrameworkCore;
using server_app.Models;

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
        public DbSet<DoctorComment> DoctorComments { get; set; }
        public DbSet<DoctorCommentType> DoctorCommentTypes { get; set; }
        public DbSet<EsculabRecord> EsculabRecords { get; set; }
        public DbSet<EsculabRecordDetails> EsculabRecordDetails { get; set; }


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

            m.Entity<EsculabRecord>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasOne(x => x.User)
                    .WithMany(u => u.EsculabRecords)
                    .HasForeignKey(x => x.UserId);
            });

            m.Entity<EsculabRecordDetails>(e =>
            {
                e.HasKey(x => x.DetailsId);
                e.HasOne(x => x.EsculabRecord)
                    .WithMany(er => er.EsculabRecordDetails)
                    .HasForeignKey(x => x.EsculabRecordId);
            });


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

                e.HasOne(x => x.EsculabRecord)
                    .WithMany(er => er.DoctorComments)
                    .HasForeignKey(x => x.EsculabRecordId);

                e.HasOne(x => x.DoctorCommentType)
                    .WithMany(dc => dc.DoctorComments)
                    .HasForeignKey(x => x.DoctorCommentTypeId);
            });
        }
    }
}
