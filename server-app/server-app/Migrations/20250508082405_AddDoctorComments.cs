using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server_app.Migrations
{
    /// <inheritdoc />
    public partial class AddDoctorComments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "DoctorAccesses",
                keyColumn: "Id",
                keyValue: new Guid("12345678-1234-1234-1234-1234567890ab"));

            migrationBuilder.DeleteData(
                table: "DoctorAccesses",
                keyColumn: "Id",
                keyValue: new Guid("87654321-4321-4321-4321-ba0987654321"));

            migrationBuilder.DeleteData(
                table: "MedicalRecords",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"));

            migrationBuilder.DeleteData(
                table: "MedicalRecords",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"));

            migrationBuilder.DeleteData(
                table: "MedicalRecords",
                keyColumn: "Id",
                keyValue: new Guid("77777777-7777-7777-7777-777777777777"));

            migrationBuilder.DeleteData(
                table: "MedicalRecords",
                keyColumn: "Id",
                keyValue: new Guid("88888888-8888-8888-8888-888888888888"));

            migrationBuilder.DeleteData(
                table: "MedicalRecords",
                keyColumn: "Id",
                keyValue: new Guid("99999999-9999-9999-9999-999999999999"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"));

            migrationBuilder.CreateTable(
                name: "DoctorCommentTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorCommentTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DoctorComments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DoctorAccessId = table.Column<Guid>(type: "uuid", nullable: false),
                    MedicalRecordId = table.Column<Guid>(type: "uuid", nullable: false),
                    DoctorCommentTypeId = table.Column<Guid>(type: "uuid", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DoctorComments_DoctorAccesses_DoctorAccessId",
                        column: x => x.DoctorAccessId,
                        principalTable: "DoctorAccesses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DoctorComments_DoctorCommentTypes_DoctorCommentTypeId",
                        column: x => x.DoctorCommentTypeId,
                        principalTable: "DoctorCommentTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DoctorComments_MedicalRecords_MedicalRecordId",
                        column: x => x.MedicalRecordId,
                        principalTable: "MedicalRecords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "DoctorCommentTypes",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), "prescription" },
                    { new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), "reccomendations" },
                    { new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), "comment" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_DoctorComments_DoctorAccessId",
                table: "DoctorComments",
                column: "DoctorAccessId");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorComments_DoctorCommentTypeId",
                table: "DoctorComments",
                column: "DoctorCommentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorComments_MedicalRecordId",
                table: "DoctorComments",
                column: "MedicalRecordId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DoctorComments");

            migrationBuilder.DropTable(
                name: "DoctorCommentTypes");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "DateOfBirth", "Email", "EsculabPatientId", "EsculabPhoneNumber", "FullName", "PasswordHash", "PhoneNumber" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(1985, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), "alice.smith@example.com", null, null, "Alice Smith", "$2a$11$uG8v.z01UXD2DzTCKFTZP.U2r3koECkfjZg0Nbh3b6p5z1LGCb5BW", "+380501234567" },
                    { new Guid("22222222-2222-2222-2222-222222222222"), new DateTime(1990, 8, 15, 0, 0, 0, 0, DateTimeKind.Utc), "bob.johnson@example.com", null, null, "Bob Johnson", "$2a$11$uG8v.z01UXD2DzTCKFTZP.U2r3koECkfjZg0Nbh3b6p5z1LGCb5BW", "+380509876543" },
                    { new Guid("33333333-3333-3333-3333-333333333333"), new DateTime(1978, 2, 20, 0, 0, 0, 0, DateTimeKind.Utc), "carol.williams@example.com", null, null, "Carol Williams", "$2a$11$uG8v.z01UXD2DzTCKFTZP.U2r3koECkfjZg0Nbh3b6p5z1LGCb5BW", "+380503456789" },
                    { new Guid("44444444-4444-4444-4444-444444444444"), new DateTime(2000, 11, 30, 0, 0, 0, 0, DateTimeKind.Utc), "david.brown@example.com", null, null, "David Brown", "$2a$11$uG8v.z01UXD2DzTCKFTZP.U2r3koECkfjZg0Nbh3b6p5z1LGCb5BW", "+380507654321" }
                });

            migrationBuilder.InsertData(
                table: "DoctorAccesses",
                columns: new[] { "Id", "ExpiresAt", "GrantedAt", "Name", "OwnerUserId", "Revoked", "TargetUserId", "Token" },
                values: new object[,]
                {
                    { new Guid("12345678-1234-1234-1234-1234567890ab"), new DateTime(2024, 5, 15, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2024, 4, 15, 0, 0, 0, 0, DateTimeKind.Utc), "Dr. Gregory House", new Guid("11111111-1111-1111-1111-111111111111"), false, null, null },
                    { new Guid("87654321-4321-4321-4321-ba0987654321"), new DateTime(2024, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2024, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Dr. Meredith Grey", new Guid("22222222-2222-2222-2222-222222222222"), false, null, null }
                });

            migrationBuilder.InsertData(
                table: "MedicalRecords",
                columns: new[] { "Id", "Date", "Notes", "RecordTypeId", "Title", "UserId" },
                values: new object[,]
                {
                    { new Guid("55555555-5555-5555-5555-555555555555"), new DateTime(2024, 1, 10, 0, 0, 0, 0, DateTimeKind.Utc), null, new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), "Complete Blood Count", new Guid("11111111-1111-1111-1111-111111111111") },
                    { new Guid("66666666-6666-6666-6666-666666666666"), new DateTime(2024, 2, 5, 0, 0, 0, 0, DateTimeKind.Utc), null, new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), "Chest X-Ray", new Guid("11111111-1111-1111-1111-111111111111") },
                    { new Guid("77777777-7777-7777-7777-777777777777"), new DateTime(2024, 3, 12, 0, 0, 0, 0, DateTimeKind.Utc), null, new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), "Dermatology Consultation", new Guid("22222222-2222-2222-2222-222222222222") },
                    { new Guid("88888888-8888-8888-8888-888888888888"), new DateTime(2024, 3, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), "Blood Pressure Medication", new Guid("33333333-3333-3333-3333-333333333333") },
                    { new Guid("99999999-9999-9999-9999-999999999999"), new DateTime(2023, 12, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), "Appendectomy", new Guid("44444444-4444-4444-4444-444444444444") }
                });
        }
    }
}
