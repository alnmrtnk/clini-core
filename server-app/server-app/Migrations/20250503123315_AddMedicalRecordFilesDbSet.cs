using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server_app.Migrations
{
    /// <inheritdoc />
    public partial class AddMedicalRecordFilesDbSet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MedicalRecordFile_MedicalRecords_MedicalRecordId",
                table: "MedicalRecordFile");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MedicalRecordFile",
                table: "MedicalRecordFile");

            migrationBuilder.RenameTable(
                name: "MedicalRecordFile",
                newName: "MedicalRecordFiles");

            migrationBuilder.RenameIndex(
                name: "IX_MedicalRecordFile_MedicalRecordId",
                table: "MedicalRecordFiles",
                newName: "IX_MedicalRecordFiles_MedicalRecordId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MedicalRecordFiles",
                table: "MedicalRecordFiles",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalRecordFiles_MedicalRecords_MedicalRecordId",
                table: "MedicalRecordFiles",
                column: "MedicalRecordId",
                principalTable: "MedicalRecords",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MedicalRecordFiles_MedicalRecords_MedicalRecordId",
                table: "MedicalRecordFiles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MedicalRecordFiles",
                table: "MedicalRecordFiles");

            migrationBuilder.RenameTable(
                name: "MedicalRecordFiles",
                newName: "MedicalRecordFile");

            migrationBuilder.RenameIndex(
                name: "IX_MedicalRecordFiles_MedicalRecordId",
                table: "MedicalRecordFile",
                newName: "IX_MedicalRecordFile_MedicalRecordId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MedicalRecordFile",
                table: "MedicalRecordFile",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalRecordFile_MedicalRecords_MedicalRecordId",
                table: "MedicalRecordFile",
                column: "MedicalRecordId",
                principalTable: "MedicalRecords",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
