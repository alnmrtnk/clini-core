using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server_app.Migrations
{
    /// <inheritdoc />
    public partial class RemoveMesurementsAndVaccinations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HealthMeasurements");

            migrationBuilder.DropTable(
                name: "Vaccinations");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HealthMeasurements",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    MeasuredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    MeasurementType = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: false)
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
                name: "Vaccinations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    DateAdministered = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DoseNumber = table.Column<int>(type: "integer", nullable: false),
                    VaccineName = table.Column<string>(type: "text", nullable: false)
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
                table: "HealthMeasurements",
                columns: new[] { "Id", "MeasuredAt", "MeasurementType", "UserId", "Value" },
                values: new object[,]
                {
                    { new Guid("abcdefab-cdef-abcd-efab-cdefabcdefab"), new DateTime(2024, 4, 3, 0, 0, 0, 0, DateTimeKind.Utc), "Weight", new Guid("33333333-3333-3333-3333-333333333333"), "68 kg" },
                    { new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"), new DateTime(2024, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), "BloodPressure", new Guid("11111111-1111-1111-1111-111111111111"), "118/76" },
                    { new Guid("ffffffff-ffff-ffff-ffff-ffffffffffff"), new DateTime(2024, 4, 2, 0, 0, 0, 0, DateTimeKind.Utc), "BloodSugar", new Guid("22222222-2222-2222-2222-222222222222"), "5.4 mmol/L" }
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
                name: "IX_HealthMeasurements_UserId",
                table: "HealthMeasurements",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Vaccinations_UserId",
                table: "Vaccinations",
                column: "UserId");
        }
    }
}
