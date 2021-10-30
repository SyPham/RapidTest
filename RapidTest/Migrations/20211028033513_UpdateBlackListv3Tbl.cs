using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RapidTest.Migrations
{
    public partial class UpdateBlackListv3Tbl : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "FirstWorkDate",
                table: "BlackList",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastAccessControlDateTime",
                table: "BlackList",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastCheckInDateTime",
                table: "BlackList",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastCheckOutDateTime",
                table: "BlackList",
                type: "datetime2",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FirstWorkDate",
                table: "BlackList");

            migrationBuilder.DropColumn(
                name: "LastAccessControlDateTime",
                table: "BlackList");

            migrationBuilder.DropColumn(
                name: "LastCheckInDateTime",
                table: "BlackList");

            migrationBuilder.DropColumn(
                name: "LastCheckOutDateTime",
                table: "BlackList");
        }
    }
}
