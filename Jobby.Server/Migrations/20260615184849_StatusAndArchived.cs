using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Jobby.Server.Migrations
{
    /// <inheritdoc />
    public partial class StatusAndArchived : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsAccepted",
                table: "JobApps");

            migrationBuilder.RenameColumn(
                name: "IsRejected",
                table: "JobApps",
                newName: "IsArchived");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "JobApps",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "JobApps");

            migrationBuilder.RenameColumn(
                name: "IsArchived",
                table: "JobApps",
                newName: "IsRejected");

            migrationBuilder.AddColumn<bool>(
                name: "IsAccepted",
                table: "JobApps",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
