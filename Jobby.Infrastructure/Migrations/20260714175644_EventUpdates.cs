using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Jobby.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class EventUpdates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobEvents_Recruiters_RecruitId",
                table: "JobEvents");

            migrationBuilder.RenameColumn(
                name: "RecruitId",
                table: "JobEvents",
                newName: "RecruiterId");

            migrationBuilder.RenameIndex(
                name: "IX_JobEvents_RecruitId",
                table: "JobEvents",
                newName: "IX_JobEvents_RecruiterId");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "JobEvents",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_JobEvents_UserId",
                table: "JobEvents",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_JobEvents_AspNetUsers_UserId",
                table: "JobEvents",
                column: "UserId",
                principalTable: "AspNetUsers",
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
                name: "FK_JobEvents_Recruiters_RecruiterId",
                table: "JobEvents");

            migrationBuilder.DropIndex(
                name: "IX_JobEvents_UserId",
                table: "JobEvents");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "JobEvents");

            migrationBuilder.RenameColumn(
                name: "RecruiterId",
                table: "JobEvents",
                newName: "RecruitId");

            migrationBuilder.RenameIndex(
                name: "IX_JobEvents_RecruiterId",
                table: "JobEvents",
                newName: "IX_JobEvents_RecruitId");

            migrationBuilder.AddForeignKey(
                name: "FK_JobEvents_Recruiters_RecruitId",
                table: "JobEvents",
                column: "RecruitId",
                principalTable: "Recruiters",
                principalColumn: "Id");
        }
    }
}
