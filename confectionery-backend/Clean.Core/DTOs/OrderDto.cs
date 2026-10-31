using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Clean.Core.Entities;

namespace Clean.Core.DTOs
{
    public class OrderDto
    {
        public int id { get; set; }
        public Client client { get; set; }
        public DateTime? deliveryDate { get; set; }
        public string? notes { get; set; }
        public string? status { get; set; }
    }
}
