using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server_app.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDoctorAcesses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorAccesses_Users_UserId",
                table: "DoctorAccesses");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "DoctorAccesses",
                newName: "OwnerUserId");

            migrationBuilder.RenameColumn(
                name: "DoctorName",
                table: "DoctorAccesses",
                newName: "Name");

            migrationBuilder.RenameIndex(
                name: "IX_DoctorAccesses_UserId",
                table: "DoctorAccesses",
                newName: "IX_DoctorAccesses_OwnerUserId");

            migrationBuilder.AddColumn<bool>(
                name: "Revoked",
                table: "DoctorAccesses",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "TargetUserId",
                table: "DoctorAccesses",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Token",
                table: "DoctorAccesses",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "DoctorAccesses",
                keyColumn: "Id",
                keyValue: new Guid("12345678-1234-1234-1234-1234567890ab"),
                columns: new[] { "Revoked", "TargetUserId", "Token" },
                values: new object[] { false, null, null });

            migrationBuilder.UpdateData(
                table: "DoctorAccesses",
                keyColumn: "Id",
                keyValue: new Guid("87654321-4321-4321-4321-ba0987654321"),
                columns: new[] { "Revoked", "TargetUserId", "Token" },
                values: new object[] { false, null, null });

            migrationBuilder.CreateIndex(
                name: "IX_DoctorAccesses_TargetUserId",
                table: "DoctorAccesses",
                column: "TargetUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorAccesses_Users_OwnerUserId",
                table: "DoctorAccesses",
                column: "OwnerUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorAccesses_Users_TargetUserId",
                table: "DoctorAccesses",
                column: "TargetUserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorAccesses_Users_OwnerUserId",
                table: "DoctorAccesses");

            migrationBuilder.DropForeignKey(
                name: "FK_DoctorAccesses_Users_TargetUserId",
                table: "DoctorAccesses");

            migrationBuilder.DropIndex(
                name: "IX_DoctorAccesses_TargetUserId",
                table: "DoctorAccesses");

            migrationBuilder.DropColumn(
                name: "Revoked",
                table: "DoctorAccesses");

            migrationBuilder.DropColumn(
                name: "TargetUserId",
                table: "DoctorAccesses");

            migrationBuilder.DropColumn(
                name: "Token",
                table: "DoctorAccesses");

            migrationBuilder.RenameColumn(
                name: "OwnerUserId",
                table: "DoctorAccesses",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "DoctorAccesses",
                newName: "DoctorName");

            migrationBuilder.RenameIndex(
                name: "IX_DoctorAccesses_OwnerUserId",
                table: "DoctorAccesses",
                newName: "IX_DoctorAccesses_UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorAccesses_Users_UserId",
                table: "DoctorAccesses",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
