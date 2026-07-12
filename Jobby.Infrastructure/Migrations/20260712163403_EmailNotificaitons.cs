using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Jobby.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class EmailNotificaitons : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobEvents_JobApps_AppId",
                table: "JobEvents");

            migrationBuilder.RenameColumn(
                name: "NotificationTime",
                table: "JobEvents",
                newName: "NotificationMinutesBefore");

            migrationBuilder.AlterColumn<int>(
                name: "AppId",
                table: "JobEvents",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<int>(
                name: "RecruitId",
                table: "JobEvents",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "SendNotification",
                table: "JobEvents",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ReceiveEmailNotifications",
                table: "AspNetUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_JobEvents_RecruitId",
                table: "JobEvents",
                column: "RecruitId");

            migrationBuilder.AddForeignKey(
                name: "FK_JobEvents_JobApps_AppId",
                table: "JobEvents",
                column: "AppId",
                principalTable: "JobApps",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_JobEvents_Recruiters_RecruitId",
                table: "JobEvents",
                column: "RecruitId",
                principalTable: "Recruiters",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobEvents_JobApps_AppId",
                table: "JobEvents");

            migrationBuilder.DropForeignKey(
                name: "FK_JobEvents_Recruiters_RecruitId",
                table: "JobEvents");

            migrationBuilder.DropIndex(
                name: "IX_JobEvents_RecruitId",
                table: "JobEvents");

            migrationBuilder.DropColumn(
                name: "RecruitId",
                table: "JobEvents");

            migrationBuilder.DropColumn(
                name: "SendNotification",
                table: "JobEvents");

            migrationBuilder.DropColumn(
                name: "ReceiveEmailNotifications",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "NotificationMinutesBefore",
                table: "JobEvents",
                newName: "NotificationTime");

            migrationBuilder.AlterColumn<int>(
                name: "AppId",
                table: "JobEvents",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_JobEvents_JobApps_AppId",
                table: "JobEvents",
                column: "AppId",
                principalTable: "JobApps",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
