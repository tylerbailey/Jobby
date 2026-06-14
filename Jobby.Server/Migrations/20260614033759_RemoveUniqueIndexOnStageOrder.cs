using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Jobby.Server.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUniqueIndexOnStageOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppStages_UserId_Order",
                table: "AppStages");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_AppStages_UserId_Order",
                table: "AppStages",
                columns: new[] { "UserId", "Order" },
                unique: true);
        }
    }
}
