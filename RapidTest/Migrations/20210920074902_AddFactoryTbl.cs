using Microsoft.EntityFrameworkCore.Migrations;

namespace RapidTest.Migrations
{
    public partial class AddFactoryTbl : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FactoryId",
                table: "Employees",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Factory",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Factory", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Employees_FactoryId",
                table: "Employees",
                column: "FactoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_Factory_FactoryId",
                table: "Employees",
                column: "FactoryId",
                principalTable: "Factory",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Employees_Factory_FactoryId",
                table: "Employees");

            migrationBuilder.DropTable(
                name: "Factory");

            migrationBuilder.DropIndex(
                name: "IX_Employees_FactoryId",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "FactoryId",
                table: "Employees");
        }
    }
}
