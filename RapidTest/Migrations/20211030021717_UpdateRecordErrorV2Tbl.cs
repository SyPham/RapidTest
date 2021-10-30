using Microsoft.EntityFrameworkCore.Migrations;

namespace RapidTest.Migrations
{
    public partial class UpdateRecordErrorV2Tbl : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RecordErrors_Employees_EmployeeId",
                table: "RecordErrors");

            migrationBuilder.AlterColumn<int>(
                name: "EmployeeId",
                table: "RecordErrors",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_RecordErrors_Employees_EmployeeId",
                table: "RecordErrors",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RecordErrors_Employees_EmployeeId",
                table: "RecordErrors");

            migrationBuilder.AlterColumn<int>(
                name: "EmployeeId",
                table: "RecordErrors",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_RecordErrors_Employees_EmployeeId",
                table: "RecordErrors",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
