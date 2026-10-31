using Clean.Core.DTOs;
using Clean.Core.Entities;
using Clean.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Clean.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        // GET: api/<OrderController>
        [HttpGet]
        public IEnumerable<OrderDto> Get()
        {
            return _orderService.GetList();
        }

        // GET api/<OrderController>/5
        [HttpGet("{id}")]
        public OrderDto Get(int id)
        {
            return _orderService.GetById(id);
        }

        // POST api/<OrderController>
        [HttpPost]
        public async Task Post([FromBody] OrderDto orderDto)
        {
            await _orderService.addAsync(orderDto);
        }

        // POST api/<OrderController>/public - order from the public menu, always as a new client
        [HttpPost("public")]
        [AllowAnonymous]
        public async Task PostPublic([FromBody] OrderDto orderDto)
        {
            orderDto.id = 0;
            orderDto.client.id = 0;
            orderDto.status = "new";
            await _orderService.addAsync(orderDto);
        }

        // PUT api/<OrderController>/5
        [HttpPut("{id}")]
        public async Task Put(int id, [FromBody] OrderDto orderDto)
        {
            await _orderService.updateAsync(id, orderDto);
        }

        // DELETE api/<OrderController>/5
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _orderService.deleteAsync(id);
        }
    }
}
