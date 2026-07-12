using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Jobby.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class IncreasedCharacters : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "Recruiters",
                type: "varchar(2046)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(1024)");

            migrationBuilder.AlterColumn<string>(
                name: "EventTitle",
                table: "JobHistories",
                type: "varchar(256)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "EventDescription",
                table: "JobHistories",
                type: "varchar(512)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Color",
                table: "JobHistories",
                type: "varchar(128)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "EventTitle",
                table: "JobEvents",
                type: "varchar(256)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "EventDescription",
                table: "JobEvents",
                type: "varchar(1024)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "JobApps",
                type: "varchar(256)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(32)");

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "JobApps",
                type: "varchar(2046)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(1024)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "JobPostingUrl",
                table: "JobApps",
                type: "varchar(1024)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(512)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Company",
                table: "JobApps",
                type: "varchar(256)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(64)");

            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "JobApps",
                type: "varchar(512)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(256)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "AppStages",
                type: "varchar(128)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(32)");

            migrationBuilder.AlterColumn<string>(
                name: "Color",
                table: "AppStages",
                type: "varchar(128)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(32)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "Recruiters",
                type: "varchar(1024)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(2046)");

            migrationBuilder.AlterColumn<string>(
                name: "EventTitle",
                table: "JobHistories",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(256)");

            migrationBuilder.AlterColumn<string>(
                name: "EventDescription",
                table: "JobHistories",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(512)");

            migrationBuilder.AlterColumn<string>(
                name: "Color",
                table: "JobHistories",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(128)");

            migrationBuilder.AlterColumn<string>(
                name: "EventTitle",
                table: "JobEvents",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(256)");

            migrationBuilder.AlterColumn<string>(
                name: "EventDescription",
                table: "JobEvents",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(1024)");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "JobApps",
                type: "varchar(32)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(256)");

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "JobApps",
                type: "varchar(1024)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(2046)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "JobPostingUrl",
                table: "JobApps",
                type: "varchar(512)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(1024)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Company",
                table: "JobApps",
                type: "varchar(64)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(256)");

            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "JobApps",
                type: "varchar(256)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(512)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "AppStages",
                type: "varchar(32)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(128)");

            migrationBuilder.AlterColumn<string>(
                name: "Color",
                table: "AppStages",
                type: "varchar(32)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(128)");
        }
    }
}
