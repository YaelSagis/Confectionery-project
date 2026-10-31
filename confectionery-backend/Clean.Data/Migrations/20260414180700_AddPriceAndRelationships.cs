using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clean.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPriceAndRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "recipeId",
                table: "orders");

            migrationBuilder.RenameColumn(
                name: "clientId",
                table: "orders",
                newName: "clientid");

            migrationBuilder.AddColumn<int>(
                name: "Orderid",
                table: "recipes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "price",
                table: "recipes",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.CreateIndex(
                name: "IX_recipes_Orderid",
                table: "recipes",
                column: "Orderid");

            migrationBuilder.CreateIndex(
                name: "IX_orders_clientid",
                table: "orders",
                column: "clientid");

            migrationBuilder.AddForeignKey(
                name: "FK_orders_clients_clientid",
                table: "orders",
                column: "clientid",
                principalTable: "clients",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_recipes_orders_Orderid",
                table: "recipes",
                column: "Orderid",
                principalTable: "orders",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_orders_clients_clientid",
                table: "orders");

            migrationBuilder.DropForeignKey(
                name: "FK_recipes_orders_Orderid",
                table: "recipes");

            migrationBuilder.DropIndex(
                name: "IX_recipes_Orderid",
                table: "recipes");

            migrationBuilder.DropIndex(
                name: "IX_orders_clientid",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "Orderid",
                table: "recipes");

            migrationBuilder.DropColumn(
                name: "price",
                table: "recipes");

            migrationBuilder.RenameColumn(
                name: "clientid",
                table: "orders",
                newName: "clientId");

            migrationBuilder.AddColumn<int>(
                name: "recipeId",
                table: "orders",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
