using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server_app.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDoctorCommentWithIsPublicProp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPublic",
                table: "DoctorComments",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPublic",
                table: "DoctorComments");
        }
    }
}
