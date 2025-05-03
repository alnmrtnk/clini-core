using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server_app.Migrations
{
    /// <inheritdoc />
    public partial class AddNotesMedicalRecord : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "MedicalRecords",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "MedicalRecords",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"),
                column: "Notes",
                value: null);

            migrationBuilder.UpdateData(
                table: "MedicalRecords",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"),
                column: "Notes",
                value: null);

            migrationBuilder.UpdateData(
                table: "MedicalRecords",
                keyColumn: "Id",
                keyValue: new Guid("77777777-7777-7777-7777-777777777777"),
                column: "Notes",
                value: null);

            migrationBuilder.UpdateData(
                table: "MedicalRecords",
                keyColumn: "Id",
                keyValue: new Guid("88888888-8888-8888-8888-888888888888"),
                column: "Notes",
                value: null);

            migrationBuilder.UpdateData(
                table: "MedicalRecords",
                keyColumn: "Id",
                keyValue: new Guid("99999999-9999-9999-9999-999999999999"),
                column: "Notes",
                value: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Notes",
                table: "MedicalRecords");
        }
    }
}
