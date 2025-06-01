using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server_app.Migrations
{
    /// <inheritdoc />
    public partial class AddEsculabRecordsToDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorComments_MedicalRecords_MedicalRecordId",
                table: "DoctorComments");

            migrationBuilder.AlterColumn<Guid>(
                name: "MedicalRecordId",
                table: "DoctorComments",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<Guid>(
                name: "EsculabRecordId",
                table: "DoctorComments",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "EsculabRecord",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Dt = table.Column<string>(type: "text", nullable: false),
                    IdGrTest = table.Column<int>(type: "integer", nullable: false),
                    Address = table.Column<string>(type: "text", nullable: false),
                    Ready = table.Column<string>(type: "text", nullable: false),
                    Total = table.Column<int>(type: "integer", nullable: false),
                    StringAgg = table.Column<string>(type: "text", nullable: true),
                    Packet = table.Column<string>(type: "text", nullable: false),
                    IdOrder = table.Column<int>(type: "integer", nullable: false),
                    IdClient = table.Column<int>(type: "integer", nullable: false),
                    Fullname = table.Column<string>(type: "text", nullable: false),
                    State = table.Column<string>(type: "text", nullable: false),
                    Deleted = table.Column<bool>(type: "boolean", nullable: false),
                    Rating = table.Column<int>(type: "integer", nullable: false),
                    Last = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EsculabRecord", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EsculabRecord_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EsculabRecordDetails",
                columns: table => new
                {
                    DetailsId = table.Column<Guid>(type: "uuid", nullable: false),
                    EsculabRecordId = table.Column<Guid>(type: "uuid", nullable: false),
                    idOrdertest = table.Column<int>(type: "integer", nullable: false),
                    id = table.Column<int>(type: "integer", nullable: false),
                    idgrtest = table.Column<int>(type: "integer", nullable: false),
                    idtest = table.Column<int>(type: "integer", nullable: false),
                    idgrnorm = table.Column<int>(type: "integer", nullable: false),
                    result = table.Column<string>(type: "text", nullable: true),
                    barcode = table.Column<string>(type: "text", nullable: true),
                    utime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    role = table.Column<string>(type: "text", nullable: true),
                    packet = table.Column<string>(type: "text", nullable: true),
                    test = table.Column<string>(type: "text", nullable: true),
                    state = table.Column<string>(type: "text", nullable: true),
                    resulttype = table.Column<string>(type: "text", nullable: true),
                    normheader = table.Column<string>(type: "text", nullable: true),
                    height = table.Column<double>(type: "double precision", nullable: false),
                    cnt = table.Column<int>(type: "integer", nullable: false),
                    idlaborant = table.Column<int>(type: "integer", nullable: false),
                    resultlighting = table.Column<int>(type: "integer", nullable: false),
                    resulttmlt = table.Column<string>(type: "text", nullable: true),
                    material = table.Column<string>(type: "text", nullable: true),
                    post = table.Column<string>(type: "text", nullable: true),
                    laborant = table.Column<string>(type: "text", nullable: true),
                    norm = table.Column<string>(type: "text", nullable: true),
                    units = table.Column<string>(type: "text", nullable: true),
                    patientId = table.Column<int>(type: "integer", nullable: false),
                    patient = table.Column<string>(type: "text", nullable: true),
                    patientDt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    idOrder = table.Column<int>(type: "integer", nullable: false),
                    ready = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EsculabRecordDetails", x => x.DetailsId);
                    table.ForeignKey(
                        name: "FK_EsculabRecordDetails_EsculabRecord_EsculabRecordId",
                        column: x => x.EsculabRecordId,
                        principalTable: "EsculabRecord",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DoctorComments_EsculabRecordId",
                table: "DoctorComments",
                column: "EsculabRecordId");

            migrationBuilder.CreateIndex(
                name: "IX_EsculabRecord_UserId",
                table: "EsculabRecord",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_EsculabRecordDetails_EsculabRecordId",
                table: "EsculabRecordDetails",
                column: "EsculabRecordId");

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorComments_EsculabRecord_EsculabRecordId",
                table: "DoctorComments",
                column: "EsculabRecordId",
                principalTable: "EsculabRecord",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorComments_MedicalRecords_MedicalRecordId",
                table: "DoctorComments",
                column: "MedicalRecordId",
                principalTable: "MedicalRecords",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorComments_EsculabRecord_EsculabRecordId",
                table: "DoctorComments");

            migrationBuilder.DropForeignKey(
                name: "FK_DoctorComments_MedicalRecords_MedicalRecordId",
                table: "DoctorComments");

            migrationBuilder.DropTable(
                name: "EsculabRecordDetails");

            migrationBuilder.DropTable(
                name: "EsculabRecord");

            migrationBuilder.DropIndex(
                name: "IX_DoctorComments_EsculabRecordId",
                table: "DoctorComments");

            migrationBuilder.DropColumn(
                name: "EsculabRecordId",
                table: "DoctorComments");

            migrationBuilder.AlterColumn<Guid>(
                name: "MedicalRecordId",
                table: "DoctorComments",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorComments_MedicalRecords_MedicalRecordId",
                table: "DoctorComments",
                column: "MedicalRecordId",
                principalTable: "MedicalRecords",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
