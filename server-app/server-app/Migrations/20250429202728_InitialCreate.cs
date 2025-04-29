using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server_app.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    FullName = table.Column<string>(type: "text", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DoctorAccesses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    DoctorName = table.Column<string>(type: "text", nullable: false),
                    GrantedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorAccesses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DoctorAccesses_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HealthMeasurements",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    MeasurementType = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: false),
                    MeasuredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthMeasurements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HealthMeasurements_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MedicalRecords",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    RecordType = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicalRecords_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Vaccinations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    VaccineName = table.Column<string>(type: "text", nullable: false),
                    DoseNumber = table.Column<int>(type: "integer", nullable: false),
                    DateAdministered = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vaccinations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Vaccinations_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "DateOfBirth", "Email", "FullName", "PasswordHash", "PhoneNumber" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(1985, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), "alice.smith@example.com", "Alice Smith", "$2a$11$uG8v.z01UXD2DzTCKFTZP.U2r3koECkfjZg0Nbh3b6p5z1LGCb5BW", "+380501234567" },
                    { new Guid("22222222-2222-2222-2222-222222222222"), new DateTime(1990, 8, 15, 0, 0, 0, 0, DateTimeKind.Utc), "bob.johnson@example.com", "Bob Johnson", "$2a$11$uG8v.z01UXD2DzTCKFTZP.U2r3koECkfjZg0Nbh3b6p5z1LGCb5BW", "+380509876543" },
                    { new Guid("33333333-3333-3333-3333-333333333333"), new DateTime(1978, 2, 20, 0, 0, 0, 0, DateTimeKind.Utc), "carol.williams@example.com", "Carol Williams", "$2a$11$uG8v.z01UXD2DzTCKFTZP.U2r3koECkfjZg0Nbh3b6p5z1LGCb5BW", "+380503456789" },
                    { new Guid("44444444-4444-4444-4444-444444444444"), new DateTime(2000, 11, 30, 0, 0, 0, 0, DateTimeKind.Utc), "david.brown@example.com", "David Brown", "$2a$11$uG8v.z01UXD2DzTCKFTZP.U2r3koECkfjZg0Nbh3b6p5z1LGCb5BW", "+380507654321" }
                });

            migrationBuilder.InsertData(
                table: "DoctorAccesses",
                columns: new[] { "Id", "DoctorName", "ExpiresAt", "GrantedAt", "UserId" },
                values: new object[,]
                {
                    { new Guid("12345678-1234-1234-1234-1234567890ab"), "Dr. Gregory House", new DateTime(2024, 5, 15, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2024, 4, 15, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("11111111-1111-1111-1111-111111111111") },
                    { new Guid("87654321-4321-4321-4321-ba0987654321"), "Dr. Meredith Grey", new DateTime(2024, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2024, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("22222222-2222-2222-2222-222222222222") }
                });

            migrationBuilder.InsertData(
                table: "HealthMeasurements",
                columns: new[] { "Id", "MeasuredAt", "MeasurementType", "UserId", "Value" },
                values: new object[,]
                {
                    { new Guid("abcdefab-cdef-abcd-efab-cdefabcdefab"), new DateTime(2024, 4, 3, 0, 0, 0, 0, DateTimeKind.Utc), "Weight", new Guid("33333333-3333-3333-3333-333333333333"), "68 kg" },
                    { new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"), new DateTime(2024, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), "BloodPressure", new Guid("11111111-1111-1111-1111-111111111111"), "118/76" },
                    { new Guid("ffffffff-ffff-ffff-ffff-ffffffffffff"), new DateTime(2024, 4, 2, 0, 0, 0, 0, DateTimeKind.Utc), "BloodSugar", new Guid("22222222-2222-2222-2222-222222222222"), "5.4 mmol/L" }
                });

            migrationBuilder.InsertData(
                table: "MedicalRecords",
                columns: new[] { "Id", "Date", "RecordType", "Title", "UserId" },
                values: new object[,]
                {
                    { new Guid("55555555-5555-5555-5555-555555555555"), new DateTime(2024, 1, 10, 0, 0, 0, 0, DateTimeKind.Utc), "Lab Test", "Complete Blood Count", new Guid("11111111-1111-1111-1111-111111111111") },
                    { new Guid("66666666-6666-6666-6666-666666666666"), new DateTime(2024, 2, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Imaging", "Chest X-Ray", new Guid("11111111-1111-1111-1111-111111111111") },
                    { new Guid("77777777-7777-7777-7777-777777777777"), new DateTime(2024, 3, 12, 0, 0, 0, 0, DateTimeKind.Utc), "Doctor Visit", "Dermatology Consultation", new Guid("22222222-2222-2222-2222-222222222222") },
                    { new Guid("88888888-8888-8888-8888-888888888888"), new DateTime(2024, 3, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Prescription", "Blood Pressure Medication", new Guid("33333333-3333-3333-3333-333333333333") },
                    { new Guid("99999999-9999-9999-9999-999999999999"), new DateTime(2023, 12, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Surgery", "Appendectomy", new Guid("44444444-4444-4444-4444-444444444444") }
                });

            migrationBuilder.InsertData(
                table: "Vaccinations",
                columns: new[] { "Id", "DateAdministered", "DoseNumber", "UserId", "VaccineName" },
                values: new object[,]
                {
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), new DateTime(2023, 12, 10, 0, 0, 0, 0, DateTimeKind.Utc), 2, new Guid("11111111-1111-1111-1111-111111111111"), "COVID-19" },
                    { new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), new DateTime(2023, 10, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, new Guid("22222222-2222-2222-2222-222222222222"), "Influenza" },
                    { new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), new DateTime(2023, 9, 15, 0, 0, 0, 0, DateTimeKind.Utc), 3, new Guid("33333333-3333-3333-3333-333333333333"), "Hepatitis B" },
                    { new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), new DateTime(2023, 8, 5, 0, 0, 0, 0, DateTimeKind.Utc), 1, new Guid("44444444-4444-4444-4444-444444444444"), "Tetanus" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_DoctorAccesses_UserId",
                table: "DoctorAccesses",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthMeasurements_UserId",
                table: "HealthMeasurements",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalRecords_UserId",
                table: "MedicalRecords",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Vaccinations_UserId",
                table: "Vaccinations",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DoctorAccesses");

            migrationBuilder.DropTable(
                name: "HealthMeasurements");

            migrationBuilder.DropTable(
                name: "MedicalRecords");

            migrationBuilder.DropTable(
                name: "Vaccinations");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
