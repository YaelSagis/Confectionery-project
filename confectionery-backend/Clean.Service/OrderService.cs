using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Clean.Core.DTOs;
using Clean.Core.Entities;
using Clean.Core.Repositories;
using Clean.Core.Services;

namespace Clean.Service
{
    public class OrderService:IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IMapper _mapper;
        public OrderService(IOrderRepository orderRepository, IMapper mapper)
        {
            _orderRepository = orderRepository;
            _mapper = mapper;
        }

        public List<OrderDto> GetList()
        {
            //TODO business logic
            var order = _orderRepository.GetAll();
            return _mapper.Map<List<OrderDto>>(order);
        }
        public OrderDto GetById(int id)
        {
            var order = _orderRepository.GetById(id);
            return _mapper.Map<OrderDto>(order);
        }
        public async Task addAsync(OrderDto orderDto)
        {
            var order = _mapper.Map<Order>(orderDto);
            await _orderRepository.postAsync(order);
        }
        public async Task updateAsync(int id, OrderDto orderDto)
        {
            var order = _mapper.Map<Order>(orderDto);
            await _orderRepository.putAsync(id, order);
        }
        public async Task deleteAsync(int id)
        {
            await _orderRepository.deleteAsync(id);
        }
    }
}
