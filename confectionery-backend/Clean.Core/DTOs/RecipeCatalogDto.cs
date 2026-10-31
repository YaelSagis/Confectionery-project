using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Clean.Core.DTOs
{
    // What customers see in the public menu: no prep time / difficulty / recipe itself
    public class RecipeCatalogDto
    {
        public int id { get; set; }
        public string name { get; set; }
        public double? price { get; set; }
        public string? description { get; set; }
        public string? imageUrl { get; set; }
    }
}
