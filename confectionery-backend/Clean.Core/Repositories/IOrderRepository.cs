using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Clean.Core.Entities;

namespace Clean.Core.Repositories
{
    public interface IOrderRepository
    {
        public List<Order> GetAll();
        public Order GetById(int id);
        public Task postAsync(Order order);
        public Task putAsync(int id, Order order);
        public Task deleteAsync(int id);
    }
}
