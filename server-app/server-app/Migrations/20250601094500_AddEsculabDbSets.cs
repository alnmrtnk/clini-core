using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server_app.Migrations
{
    /// <inheritdoc />
    public partial class AddEsculabDbSets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorComments_EsculabRecord_EsculabRecordId",
                table: "DoctorComments");

            migrationBuilder.DropForeignKey(
                name: "FK_EsculabRecord_Users_UserId",
                table: "EsculabRecord");

            migrationBuilder.DropForeignKey(
                name: "FK_EsculabRecordDetails_EsculabRecord_EsculabRecordId",
                table: "EsculabRecordDetails");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EsculabRecord",
                table: "EsculabRecord");

            migrationBuilder.RenameTable(
                name: "EsculabRecord",
                newName: "EsculabRecords");

            migrationBuilder.RenameIndex(
                name: "IX_EsculabRecord_UserId",
                table: "EsculabRecords",
                newName: "IX_EsculabRecords_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EsculabRecords",
                table: "EsculabRecords",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorComments_EsculabRecords_EsculabRecordId",
                table: "DoctorComments",
                column: "EsculabRecordId",
                principalTable: "EsculabRecords",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_EsculabRecordDetails_EsculabRecords_EsculabRecordId",
                table: "EsculabRecordDetails",
                column: "EsculabRecordId",
                principalTable: "EsculabRecords",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EsculabRecords_Users_UserId",
                table: "EsculabRecords",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorComments_EsculabRecords_EsculabRecordId",
                table: "DoctorComments");

            migrationBuilder.DropForeignKey(
                name: "FK_EsculabRecordDetails_EsculabRecords_EsculabRecordId",
                table: "EsculabRecordDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_EsculabRecords_Users_UserId",
                table: "EsculabRecords");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EsculabRecords",
                table: "EsculabRecords");

            migrationBuilder.RenameTable(
                name: "EsculabRecords",
                newName: "EsculabRecord");

            migrationBuilder.RenameIndex(
                name: "IX_EsculabRecords_UserId",
                table: "EsculabRecord",
                newName: "IX_EsculabRecord_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EsculabRecord",
                table: "EsculabRecord",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorComments_EsculabRecord_EsculabRecordId",
                table: "DoctorComments",
                column: "EsculabRecordId",
                principalTable: "EsculabRecord",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_EsculabRecord_Users_UserId",
                table: "EsculabRecord",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EsculabRecordDetails_EsculabRecord_EsculabRecordId",
                table: "EsculabRecordDetails",
                column: "EsculabRecordId",
                principalTable: "EsculabRecord",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
