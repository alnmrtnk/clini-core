using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server_app.Migrations
{
    /// <inheritdoc />
    public partial class AddRecordTypeReference : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RecordType",
                table: "MedicalRecords");

            migrationBuilder.AddColumn<Guid>(
                name: "RecordTypeId",
                table: "MedicalRecords",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "RecordTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecordTypes", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "MedicalRecords",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"),
                column: "RecordTypeId",
                value: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"));

            migrationBuilder.UpdateData(
                table: "MedicalRecords",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"),
                column: "RecordTypeId",
                value: new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"));

            migrationBuilder.UpdateData(
                table: "MedicalRecords",
                keyColumn: "Id",
                keyValue: new Guid("77777777-7777-7777-7777-777777777777"),
                column: "RecordTypeId",
                value: new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"));

            migrationBuilder.UpdateData(
                table: "MedicalRecords",
                keyColumn: "Id",
                keyValue: new Guid("88888888-8888-8888-8888-888888888888"),
                column: "RecordTypeId",
                value: new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"));

            migrationBuilder.UpdateData(
                table: "MedicalRecords",
                keyColumn: "Id",
                keyValue: new Guid("99999999-9999-9999-9999-999999999999"),
                column: "RecordTypeId",
                value: new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"));

            migrationBuilder.InsertData(
                table: "RecordTypes",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), "report" },
                    { new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), "image" },
                    { new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), "prescription" },
                    { new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), "form" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_MedicalRecords_RecordTypeId",
                table: "MedicalRecords",
                column: "RecordTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalRecords_RecordTypes_RecordTypeId",
                table: "MedicalRecords",
                column: "RecordTypeId",
                principalTable: "RecordTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MedicalRecords_RecordTypes_RecordTypeId",
                table: "MedicalRecords");

            migrationBuilder.DropTable(
                name: "RecordTypes");

            migrationBuilder.DropIndex(
                name: "IX_MedicalRecords_RecordTypeId",
                table: "MedicalRecords");

            migrationBuilder.DropColumn(
                name: "RecordTypeId",
                table: "MedicalRecords");

            migrationBuilder.AddColumn<string>(
                name: "RecordType",
                table: "MedicalRecords",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "MedicalRecords",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"),
                column: "RecordType",
                value: "Lab Test");

            migrationBuilder.UpdateData(
                table: "MedicalRecords",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"),
                column: "RecordType",
                value: "Imaging");

            migrationBuilder.UpdateData(
                table: "MedicalRecords",
                keyColumn: "Id",
                keyValue: new Guid("77777777-7777-7777-7777-777777777777"),
                column: "RecordType",
                value: "Doctor Visit");

            migrationBuilder.UpdateData(
                table: "MedicalRecords",
                keyColumn: "Id",
                keyValue: new Guid("88888888-8888-8888-8888-888888888888"),
                column: "RecordType",
                value: "Prescription");

            migrationBuilder.UpdateData(
                table: "MedicalRecords",
                keyColumn: "Id",
                keyValue: new Guid("99999999-9999-9999-9999-999999999999"),
                column: "RecordType",
                value: "Surgery");
        }
    }
}
