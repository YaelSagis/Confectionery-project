using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Clean.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Clean.Data
{
    public class DataContext:DbContext
    {
        private readonly IConfiguration _configuration;
        public DbSet<Recipe> recipes { get; set; }
        public DbSet<Client> clients { get; set; }
        public DbSet<Order> orders { get; set; }

        public DataContext(IConfiguration configuration)
        {
            _configuration= configuration;
            /*recipes = new List<Recipe>()
            {
                new Recipe(){ id=1, name="Chocolate cake", prepTime= 30, difficulty= "easy", price=40 },
                new Recipe(){ id=2, name="Lemon pie", prepTime= 40, difficulty= "middle", price=55},
                new Recipe(){ id=3, name="CheeseCake", prepTime= 60, difficulty= "middle", price=70},
                new Recipe(){ id=4, name="Chocolate chip cookies", prepTime= 40, difficulty= "easy", price=35}
            };

            clients = new List<Client>()
            {שם וסיסמה
                new Client(){id=123, name="Ruth" },
                new Client(){id=456, name="Shira" },
                new Client(){id=789, name="Noa" }
            };

            orders = new List<Order>()
            {
                new Order(){id=1, clientId=123, recipeId=1, deliveryDate=DateTime.Now.AddDays(2)},
                new Order(){id=2, clientId=456, recipeId=2, deliveryDate=DateTime.Now.AddDays(3)},
                new Order(){id=3, clientId=789, recipeId=3, deliveryDate=DateTime.Now.AddDays(5)}
            };*/
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(_configuration["ConnectionString"]);
            //optionsBuilder.UseSqlServer("@Server=DESKTOP-2F25111\\SQLEXPRESS;Database=sample_db;Trusted_Connection=True;TrustServerCertificate=True");
        }
    }
}
