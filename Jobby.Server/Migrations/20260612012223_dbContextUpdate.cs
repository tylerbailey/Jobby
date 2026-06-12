using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Jobby.Server.Migrations
{
    /// <inheritdoc />
    public partial class dbContextUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobEvent_JobApps_AppId",
                table: "JobEvent");

            migrationBuilder.DropPrimaryKey(
                name: "PK_JobEvent",
                table: "JobEvent");

            migrationBuilder.RenameTable(
                name: "JobEvent",
                newName: "JobEvents");

            migrationBuilder.RenameIndex(
                name: "IX_JobEvent_AppId",
                table: "JobEvents",
                newName: "IX_JobEvents_AppId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_JobEvents",
                table: "JobEvents",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_JobEvents_JobApps_AppId",
                table: "JobEvents",
                column: "AppId",
                principalTable: "JobApps",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobEvents_JobApps_AppId",
                table: "JobEvents");

            migrationBuilder.DropPrimaryKey(
                name: "PK_JobEvents",
                table: "JobEvents");

            migrationBuilder.RenameTable(
                name: "JobEvents",
                newName: "JobEvent");

            migrationBuilder.RenameIndex(
                name: "IX_JobEvents_AppId",
                table: "JobEvent",
                newName: "IX_JobEvent_AppId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_JobEvent",
                table: "JobEvent",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_JobEvent_JobApps_AppId",
                table: "JobEvent",
                column: "AppId",
                principalTable: "JobApps",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
