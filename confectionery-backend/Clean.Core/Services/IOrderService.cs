using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Clean.Core.DTOs;
using Clean.Core.Entities;

namespace Clean.Core.Services
{
    public interface IOrderService
    {
        public List<OrderDto> GetList();
        public OrderDto GetById(int id);
        public Task addAsync(OrderDto orderDto);
        public Task updateAsync(int id, OrderDto orderDto);
        public Task deleteAsync(int id);
    }
}
