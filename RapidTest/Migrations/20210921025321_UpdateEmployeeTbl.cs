using Microsoft.EntityFrameworkCore.Migrations;

namespace RapidTest.Migrations
{
    public partial class UpdateEmployeeTbl : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "SEAInform",
                table: "Employees",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SEAInform",
                table: "Employees");
        }
    }
}
