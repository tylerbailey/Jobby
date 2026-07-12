using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Jobby.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialMove : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "NotificationSent",
                table: "JobEvents",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "NotificationTime",
                table: "JobEvents",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NotificationSent",
                table: "JobEvents");

            migrationBuilder.DropColumn(
                name: "NotificationTime",
                table: "JobEvents");
        }
    }
}
