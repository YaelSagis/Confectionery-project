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
    public class ClientController : ControllerBase
    {
        private readonly IClientService _clientService;
        public ClientController(IClientService clientService)
        {
            _clientService = clientService;
        }

        // GET: api/<ClientController>
        [HttpGet]
        public IEnumerable<ClientDto> Get()
        {
            return _clientService.GetList();
        }

        [HttpGet("test")]
        [AllowAnonymous]
        public IActionResult Test()
        {
            return Ok("WORKS");
        }

        // GET api/<ClientController>/5
        [HttpGet("{id}")]
        public ClientDto Get(int id)
        {
            return _clientService.GetById(id);
        }

        // POST api/<ClientController>
        [HttpPost]
        public async Task Post([FromBody] ClientDto clientDto)
        {
            await _clientService.addAsync(clientDto);
        }

        // PUT api/<ClientController>/5
        [HttpPut("{id}")]
        public async Task Put(int id, [FromBody] ClientDto clientDto)
        {
            await _clientService.updateAsync(id, clientDto);
        }

        // DELETE api/<ClientController>/5
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _clientService.deleteAsync(id);
        }
    }
}
