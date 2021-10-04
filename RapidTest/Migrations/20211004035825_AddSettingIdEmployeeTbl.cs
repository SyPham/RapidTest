using Microsoft.EntityFrameworkCore.Migrations;

namespace RapidTest.Migrations
{
    public partial class AddSettingIdEmployeeTbl : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Settings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SettingId",
                table: "Employees",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employees_SettingId",
                table: "Employees",
                column: "SettingId");

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_Settings_SettingId",
                table: "Employees",
                column: "SettingId",
                principalTable: "Settings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Employees_Settings_SettingId",
                table: "Employees");

            migrationBuilder.DropIndex(
                name: "IX_Employees_SettingId",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "SettingId",
                table: "Employees");
        }
    }
}
