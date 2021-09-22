using Microsoft.EntityFrameworkCore.Migrations;

namespace RapidTest.Migrations
{
    public partial class UpdateCheckInTbl : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Result",
                table: "CheckIn");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Result",
                table: "CheckIn",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
