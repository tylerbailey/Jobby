using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Jobby.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddJobAppSummary : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Summary",
                table: "JobApps",
                type: "varchar(2046)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Summary",
                table: "JobApps");
        }
    }
}
