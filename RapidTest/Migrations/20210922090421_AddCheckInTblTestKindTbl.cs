using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RapidTest.Migrations
{
    public partial class AddCheckInTblTestKindTbl : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TestKinds",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDefault = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    CreatedTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedTime = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestKinds", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CheckIn",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeId = table.Column<int>(type: "int", nullable: false),
                    TestKindId = table.Column<int>(type: "int", nullable: false),
                    Result = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    CreatedTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedTime = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CheckIn", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CheckIn_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CheckIn_TestKinds_TestKindId",
                        column: x => x.TestKindId,
                        principalTable: "TestKinds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Reports_TestKindId",
                table: "Reports",
                column: "TestKindId");

            migrationBuilder.CreateIndex(
                name: "IX_FactoryReports_TestKindId",
                table: "FactoryReports",
                column: "TestKindId");

            migrationBuilder.CreateIndex(
                name: "IX_CheckIn_EmployeeId",
                table: "CheckIn",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_CheckIn_TestKindId",
                table: "CheckIn",
                column: "TestKindId");

            migrationBuilder.AddForeignKey(
                name: "FK_FactoryReports_TestKinds_TestKindId",
                table: "FactoryReports",
                column: "TestKindId",
                principalTable: "TestKinds",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reports_TestKinds_TestKindId",
                table: "Reports",
                column: "TestKindId",
                principalTable: "TestKinds",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FactoryReports_TestKinds_TestKindId",
                table: "FactoryReports");

            migrationBuilder.DropForeignKey(
                name: "FK_Reports_TestKinds_TestKindId",
                table: "Reports");

            migrationBuilder.DropTable(
                name: "CheckIn");

            migrationBuilder.DropTable(
                name: "TestKinds");

            migrationBuilder.DropIndex(
                name: "IX_Reports_TestKindId",
                table: "Reports");

            migrationBuilder.DropIndex(
                name: "IX_FactoryReports_TestKindId",
                table: "FactoryReports");
        }
    }
}
