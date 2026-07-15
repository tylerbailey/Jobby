using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Jobby.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class EventNameChange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JobEvents");

            migrationBuilder.CreateTable(
                name: "CalendarEvents",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: true),
                    AppId = table.Column<int>(type: "integer", nullable: true),
                    RecruiterId = table.Column<int>(type: "integer", nullable: true),
                    EventTitle = table.Column<string>(type: "varchar(256)", nullable: false),
                    EventDescription = table.Column<string>(type: "varchar(1024)", nullable: false),
                    EventDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    NotificationMinutesBefore = table.Column<int>(type: "integer", nullable: false),
                    SendNotification = table.Column<bool>(type: "boolean", nullable: false),
                    NotificationSent = table.Column<bool>(type: "boolean", nullable: false),
                    Created = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Modified = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Disabled = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CalendarEvents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CalendarEvents_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CalendarEvents_JobApps_AppId",
                        column: x => x.AppId,
                        principalTable: "JobApps",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CalendarEvents_Recruiters_RecruiterId",
                        column: x => x.RecruiterId,
                        principalTable: "Recruiters",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_CalendarEvents_AppId",
                table: "CalendarEvents",
                column: "AppId");

            migrationBuilder.CreateIndex(
                name: "IX_CalendarEvents_RecruiterId",
                table: "CalendarEvents",
                column: "RecruiterId");

            migrationBuilder.CreateIndex(
                name: "IX_CalendarEvents_UserId",
                table: "CalendarEvents",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CalendarEvents");

            migrationBuilder.CreateTable(
                name: "JobEvents",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AppId = table.Column<int>(type: "integer", nullable: true),
                    RecruiterId = table.Column<int>(type: "integer", nullable: true),
                    UserId = table.Column<string>(type: "text", nullable: true),
                    Created = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Disabled = table.Column<bool>(type: "boolean", nullable: false),
                    EventDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EventDescription = table.Column<string>(type: "varchar(1024)", nullable: false),
                    EventTitle = table.Column<string>(type: "varchar(256)", nullable: false),
                    Modified = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    NotificationMinutesBefore = table.Column<int>(type: "integer", nullable: false),
                    NotificationSent = table.Column<bool>(type: "boolean", nullable: false),
                    SendNotification = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobEvents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JobEvents_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_JobEvents_JobApps_AppId",
                        column: x => x.AppId,
                        principalTable: "JobApps",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_JobEvents_Recruiters_RecruiterId",
                        column: x => x.RecruiterId,
                        principalTable: "Recruiters",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_JobEvents_AppId",
                table: "JobEvents",
                column: "AppId");

            migrationBuilder.CreateIndex(
                name: "IX_JobEvents_RecruiterId",
                table: "JobEvents",
                column: "RecruiterId");

            migrationBuilder.CreateIndex(
                name: "IX_JobEvents_UserId",
                table: "JobEvents",
                column: "UserId");
        }
    }
}
