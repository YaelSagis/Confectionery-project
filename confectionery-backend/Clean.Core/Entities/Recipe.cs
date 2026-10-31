using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Clean.Core.Entities
{
    public class Recipe
    {
        public int id { get; set; }
        public string name { get; set; }
        public int? prepTime { get; set; }
        public string? difficulty { get; set; }
        public double? price { get; set; }
        public string? description { get; set; }
        public string? imageUrl { get; set; }
        public string? ingredients { get; set; }
        public string? instructions { get; set; }
    }
}
