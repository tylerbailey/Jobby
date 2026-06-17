using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Jobby.Server.Migrations
{
    /// <inheritdoc />
    public partial class Recruiter : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "JobPostingUrl",
                table: "JobApps",
                type: "varchar(512)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(256)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RecruitorId",
                table: "JobApps",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Recruiters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "varchar(64)", nullable: false),
                    Agency = table.Column<string>(type: "varchar(64)", nullable: false),
                    Email = table.Column<string>(type: "varchar(64)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "varchar(12)", nullable: false),
                    Notes = table.Column<string>(type: "varchar(1024)", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Disabled = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recruiters", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_JobApps_RecruitorId",
                table: "JobApps",
                column: "RecruitorId");

            migrationBuilder.AddForeignKey(
                name: "FK_JobApps_Recruiters_RecruitorId",
                table: "JobApps",
                column: "RecruitorId",
                principalTable: "Recruiters",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobApps_Recruiters_RecruitorId",
                table: "JobApps");

            migrationBuilder.DropTable(
                name: "Recruiters");

            migrationBuilder.DropIndex(
                name: "IX_JobApps_RecruitorId",
                table: "JobApps");

            migrationBuilder.DropColumn(
                name: "RecruitorId",
                table: "JobApps");

            migrationBuilder.AlterColumn<string>(
                name: "JobPostingUrl",
                table: "JobApps",
                type: "varchar(256)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(512)",
                oldNullable: true);
        }
    }
}
