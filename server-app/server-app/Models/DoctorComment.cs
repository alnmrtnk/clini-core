﻿using System.Globalization;

namespace server_app.Models
{
    public class DoctorComment
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public required Guid DoctorAccessId { get; set; }

        public required Guid MedicalRecordId { get; set; }

        public required Guid DoctorCommentTypeId { get; set; }

        public required string Content { get; set; }

        public DateTime Date {  get; set; } = DateTime.UtcNow;

        public DoctorAccess DoctorAccess { get; set; } = null!;

        public MedicalRecord MedicalRecord { get; set; } = null!;

        public DoctorCommentType DoctorCommentType { get; set; } = null!;
    }
}
