using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Jobby.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddEvents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastContactDate",
                table: "JobApps");

            migrationBuilder.DropColumn(
                name: "NextContactDate",
                table: "JobApps");

            migrationBuilder.DropColumn(
                name: "Upcoming",
                table: "JobApps");

            migrationBuilder.DropColumn(
                name: "UpcomingType",
                table: "JobApps");

            migrationBuilder.AddColumn<bool>(
                name: "IsAccepted",
                table: "JobApps",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsRejected",
                table: "JobApps",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "Color",
                table: "AppStages",
                type: "varchar(32)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(64)");

            migrationBuilder.CreateTable(
                name: "JobEvent",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AppId = table.Column<int>(type: "int", nullable: false),
                    EventTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EventDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EventDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Disabled = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobEvent", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JobEvent_JobApps_AppId",
                        column: x => x.AppId,
                        principalTable: "JobApps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_JobEvent_AppId",
                table: "JobEvent",
                column: "AppId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JobEvent");

            migrationBuilder.DropColumn(
                name: "IsAccepted",
                table: "JobApps");

            migrationBuilder.DropColumn(
                name: "IsRejected",
                table: "JobApps");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastContactDate",
                table: "JobApps",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NextContactDate",
                table: "JobApps",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Upcoming",
                table: "JobApps",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpcomingType",
                table: "JobApps",
                type: "varchar(16)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Color",
                table: "AppStages",
                type: "varchar(64)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(32)");
        }
    }
}
