using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Clean.Core.Entities
{
    public class Order
    {
        public int id { get; set; }
        public Client client { get; set; }
        public List<Recipe>? recipes { get; set; }
        //public int recipeId { get; set; }
        public DateTime? deliveryDate { get; set; }
        public string? notes { get; set; }
        public string? status { get; set; }
    }
}
