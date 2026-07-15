using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Jobby.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class EventReadd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobEvent_AspNetUsers_UserId",
                table: "JobEvent");

            migrationBuilder.DropForeignKey(
                name: "FK_JobEvent_JobApps_AppId",
                table: "JobEvent");

            migrationBuilder.DropForeignKey(
                name: "FK_JobEvent_Recruiters_RecruiterId",
                table: "JobEvent");

            migrationBuilder.DropPrimaryKey(
                name: "PK_JobEvent",
                table: "JobEvent");

            migrationBuilder.RenameTable(
                name: "JobEvent",
                newName: "JobEvents");

            migrationBuilder.RenameIndex(
                name: "IX_JobEvent_UserId",
                table: "JobEvents",
                newName: "IX_JobEvents_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_JobEvent_RecruiterId",
                table: "JobEvents",
                newName: "IX_JobEvents_RecruiterId");

            migrationBuilder.RenameIndex(
                name: "IX_JobEvent_AppId",
                table: "JobEvents",
                newName: "IX_JobEvents_AppId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_JobEvents",
                table: "JobEvents",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_JobEvents_AspNetUsers_UserId",
                table: "JobEvents",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_JobEvents_JobApps_AppId",
                table: "JobEvents",
                column: "AppId",
                principalTable: "JobApps",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_JobEvents_Recruiters_RecruiterId",
                table: "JobEvents",
                column: "RecruiterId",
                principalTable: "Recruiters",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobEvents_AspNetUsers_UserId",
                table: "JobEvents");

            migrationBuilder.DropForeignKey(
                name: "FK_JobEvents_JobApps_AppId",
                table: "JobEvents");

            migrationBuilder.DropForeignKey(
                name: "FK_JobEvents_Recruiters_RecruiterId",
                table: "JobEvents");

            migrationBuilder.DropPrimaryKey(
                name: "PK_JobEvents",
                table: "JobEvents");

            migrationBuilder.RenameTable(
                name: "JobEvents",
                newName: "JobEvent");

            migrationBuilder.RenameIndex(
                name: "IX_JobEvents_UserId",
                table: "JobEvent",
                newName: "IX_JobEvent_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_JobEvents_RecruiterId",
                table: "JobEvent",
                newName: "IX_JobEvent_RecruiterId");

            migrationBuilder.RenameIndex(
                name: "IX_JobEvents_AppId",
                table: "JobEvent",
                newName: "IX_JobEvent_AppId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_JobEvent",
                table: "JobEvent",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_JobEvent_AspNetUsers_UserId",
                table: "JobEvent",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_JobEvent_JobApps_AppId",
                table: "JobEvent",
                column: "AppId",
                principalTable: "JobApps",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_JobEvent_Recruiters_RecruiterId",
                table: "JobEvent",
                column: "RecruiterId",
                principalTable: "Recruiters",
                principalColumn: "Id");
        }
    }
}
