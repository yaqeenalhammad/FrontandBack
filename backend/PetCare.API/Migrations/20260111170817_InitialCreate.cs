using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetCare.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LostPetPosts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PostType = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false),
                    TagId = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    AgeMonths = table.Column<int>(type: "INTEGER", nullable: false),
                    LastSeen = table.Column<string>(type: "TEXT", maxLength: 120, nullable: false),
                    PetType = table.Column<string>(type: "TEXT", maxLength: 30, nullable: false),
                    PetName = table.Column<string>(type: "TEXT", maxLength: 60, nullable: true),
                    Gender = table.Column<string>(type: "TEXT", maxLength: 15, nullable: true),
                    Color = table.Column<string>(type: "TEXT", maxLength: 30, nullable: true),
                    Description = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    City = table.Column<string>(type: "TEXT", maxLength: 40, nullable: true),
                    Area = table.Column<string>(type: "TEXT", maxLength: 40, nullable: true),
                    ContactPhone = table.Column<string>(type: "TEXT", maxLength: 40, nullable: true),
                    Reward = table.Column<string>(type: "TEXT", maxLength: 40, nullable: true),
                    LostDate = table.Column<string>(type: "TEXT", maxLength: 25, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LostPetPosts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FullName = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false),
                    Role = table.Column<string>(type: "TEXT", nullable: false),
                    IsApproved = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LostPetImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    LostPetPostId = table.Column<int>(type: "INTEGER", nullable: false),
                    Url = table.Column<string>(type: "TEXT", maxLength: 300, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LostPetImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LostPetImages_LostPetPosts_LostPetPostId",
                        column: x => x.LostPetPostId,
                        principalTable: "LostPetPosts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LostPetImages_LostPetPostId",
                table: "LostPetImages",
                column: "LostPetPostId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LostPetImages");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "LostPetPosts");
        }
    }
}
