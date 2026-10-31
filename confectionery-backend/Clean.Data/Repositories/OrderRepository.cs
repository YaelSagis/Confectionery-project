using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Clean.Core.Entities;
using Clean.Core.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Clean.Data.Repositories
{
    public class OrderRepository: IOrderRepository
    {
        private readonly DataContext _dataContext;

        public OrderRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public List<Order> GetAll()
        {
            return _dataContext.orders.Include(o => o.client).ToList();
        }

        public Order GetById(int id)
        {
            return _dataContext.orders.Include(o => o.client).FirstOrDefault(o => o.id == id);
        }
        public async Task postAsync(Order order)
        {
            AttachExistingClient(order);
            _dataContext.orders.Add(order);
            await _dataContext.SaveChangesAsync();
        }
        public async Task putAsync(int id, Order order)
        {
            Order o = _dataContext.orders.Find(id);
            if (o != null)
            {
                AttachExistingClient(order);
                o.id = id;
                o.client = order.client;
                o.recipes = order.recipes;
                o.deliveryDate = order.deliveryDate;
                o.notes = order.notes;
                o.status = order.status;
                await _dataContext.SaveChangesAsync();
            }
        }
        private void AttachExistingClient(Order order)
        {
            if (order.client != null && order.client.id != 0)
                order.client = _dataContext.clients.Find(order.client.id);
        }

        public async Task deleteAsync(int id)
        {
            Order o = _dataContext.orders.Find(id);
            if (o != null)
            {
                _dataContext.orders.Remove(o);
                await _dataContext.SaveChangesAsync();
            }
        }
    }
}
