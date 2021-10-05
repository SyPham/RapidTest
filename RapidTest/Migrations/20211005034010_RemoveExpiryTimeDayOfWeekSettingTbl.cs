using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RapidTest.Migrations
{
    public partial class RemoveExpiryTimeDayOfWeekSettingTbl : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExpiryTime",
                table: "Settings");

            migrationBuilder.AddColumn<double>(
                name: "Hours",
                table: "Settings",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Hours",
                table: "Settings");

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpiryTime",
                table: "Settings",
                type: "datetime2",
                nullable: true);
        }
    }
}
