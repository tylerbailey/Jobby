using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Jobby.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ModelChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CalendarEvents_JobApps_AppId",
                table: "CalendarEvents");

            migrationBuilder.DropForeignKey(
                name: "FK_JobHistories_JobApps_AppId",
                table: "JobHistories");

            migrationBuilder.DropTable(
                name: "JobApps");

            migrationBuilder.DropTable(
                name: "AppStages");

            migrationBuilder.DropColumn(
                name: "NotificationMinutesBefore",
                table: "CalendarEvents");

            migrationBuilder.DropColumn(
                name: "NotificationSent",
                table: "CalendarEvents");

            migrationBuilder.DropColumn(
                name: "SendNotification",
                table: "CalendarEvents");

            migrationBuilder.DropColumn(
                name: "ReceiveEmailNotifications",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "AppId",
                table: "JobHistories",
                newName: "JobId");

            migrationBuilder.RenameIndex(
                name: "IX_JobHistories_AppId",
                table: "JobHistories",
                newName: "IX_JobHistories_JobId");

            migrationBuilder.RenameColumn(
                name: "AppId",
                table: "CalendarEvents",
                newName: "JobId");

            migrationBuilder.RenameIndex(
                name: "IX_CalendarEvents_AppId",
                table: "CalendarEvents",
                newName: "IX_CalendarEvents_JobId");

            migrationBuilder.CreateTable(
                name: "JobStages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "varchar(450)", nullable: false),
                    Name = table.Column<string>(type: "varchar(128)", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Color = table.Column<string>(type: "varchar(128)", nullable: false),
                    Created = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Modified = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Disabled = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobStages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Jobs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "varchar(450)", nullable: false),
                    Company = table.Column<string>(type: "varchar(256)", nullable: false),
                    Title = table.Column<string>(type: "varchar(256)", nullable: false),
                    Summary = table.Column<string>(type: "varchar(2046)", nullable: false),
                    JobPostingUrl = table.Column<string>(type: "varchar(1024)", nullable: false),
                    Address = table.Column<string>(type: "varchar(512)", nullable: false),
                    Salary = table.Column<int>(type: "integer", nullable: true),
                    StageId = table.Column<int>(type: "integer", nullable: false),
                    LocationTypeId = table.Column<int>(type: "integer", nullable: false),
                    Notes = table.Column<string>(type: "varchar(2046)", nullable: false),
                    ContactName = table.Column<string>(type: "varchar(256)", nullable: false),
                    Applied = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    IsArchived = table.Column<bool>(type: "boolean", nullable: false),
                    RecruitorId = table.Column<int>(type: "integer", nullable: true),
                    Created = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Modified = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Disabled = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Jobs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Jobs_JobStages_StageId",
                        column: x => x.StageId,
                        principalTable: "JobStages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Jobs_LocationTypes_LocationTypeId",
                        column: x => x.LocationTypeId,
                        principalTable: "LocationTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Jobs_Recruiters_RecruitorId",
                        column: x => x.RecruitorId,
                        principalTable: "Recruiters",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Jobs_LocationTypeId",
                table: "Jobs",
                column: "LocationTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Jobs_RecruitorId",
                table: "Jobs",
                column: "RecruitorId");

            migrationBuilder.CreateIndex(
                name: "IX_Jobs_StageId",
                table: "Jobs",
                column: "StageId");

            migrationBuilder.AddForeignKey(
                name: "FK_CalendarEvents_Jobs_JobId",
                table: "CalendarEvents",
                column: "JobId",
                principalTable: "Jobs",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_JobHistories_Jobs_JobId",
                table: "JobHistories",
                column: "JobId",
                principalTable: "Jobs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CalendarEvents_Jobs_JobId",
                table: "CalendarEvents");

            migrationBuilder.DropForeignKey(
                name: "FK_JobHistories_Jobs_JobId",
                table: "JobHistories");

            migrationBuilder.DropTable(
                name: "Jobs");

            migrationBuilder.DropTable(
                name: "JobStages");

            migrationBuilder.RenameColumn(
                name: "JobId",
                table: "JobHistories",
                newName: "AppId");

            migrationBuilder.RenameIndex(
                name: "IX_JobHistories_JobId",
                table: "JobHistories",
                newName: "IX_JobHistories_AppId");

            migrationBuilder.RenameColumn(
                name: "JobId",
                table: "CalendarEvents",
                newName: "AppId");

            migrationBuilder.RenameIndex(
                name: "IX_CalendarEvents_JobId",
                table: "CalendarEvents",
                newName: "IX_CalendarEvents_AppId");

            migrationBuilder.AddColumn<int>(
                name: "NotificationMinutesBefore",
                table: "CalendarEvents",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "NotificationSent",
                table: "CalendarEvents",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "SendNotification",
                table: "CalendarEvents",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ReceiveEmailNotifications",
                table: "AspNetUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "AppStages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Color = table.Column<string>(type: "varchar(128)", nullable: false),
                    Created = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Disabled = table.Column<bool>(type: "boolean", nullable: false),
                    Modified = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Name = table.Column<string>(type: "varchar(128)", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<string>(type: "varchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppStages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "JobApps",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LocationTypeId = table.Column<int>(type: "integer", nullable: false),
                    RecruitorId = table.Column<int>(type: "integer", nullable: true),
                    StageId = table.Column<int>(type: "integer", nullable: false),
                    Address = table.Column<string>(type: "varchar(512)", nullable: true),
                    Applied = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Company = table.Column<string>(type: "varchar(256)", nullable: false),
                    ContactName = table.Column<string>(type: "varchar(256)", nullable: true),
                    Created = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Disabled = table.Column<bool>(type: "boolean", nullable: false),
                    IsArchived = table.Column<bool>(type: "boolean", nullable: false),
                    JobPostingUrl = table.Column<string>(type: "varchar(1024)", nullable: true),
                    Modified = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Notes = table.Column<string>(type: "varchar(2046)", nullable: true),
                    Salary = table.Column<int>(type: "integer", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Summary = table.Column<string>(type: "varchar(2046)", nullable: true),
                    Title = table.Column<string>(type: "varchar(256)", nullable: false),
                    UserId = table.Column<string>(type: "varchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobApps", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JobApps_AppStages_StageId",
                        column: x => x.StageId,
                        principalTable: "AppStages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_JobApps_LocationTypes_LocationTypeId",
                        column: x => x.LocationTypeId,
                        principalTable: "LocationTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_JobApps_Recruiters_RecruitorId",
                        column: x => x.RecruitorId,
                        principalTable: "Recruiters",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_JobApps_LocationTypeId",
                table: "JobApps",
                column: "LocationTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_JobApps_RecruitorId",
                table: "JobApps",
                column: "RecruitorId");

            migrationBuilder.CreateIndex(
                name: "IX_JobApps_StageId",
                table: "JobApps",
                column: "StageId");

            migrationBuilder.AddForeignKey(
                name: "FK_CalendarEvents_JobApps_AppId",
                table: "CalendarEvents",
                column: "AppId",
                principalTable: "JobApps",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_JobHistories_JobApps_AppId",
                table: "JobHistories",
                column: "AppId",
                principalTable: "JobApps",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
