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
    public class RecipeController : ControllerBase
    {
        private readonly IRecipeService _recipeService;

        public RecipeController(IRecipeService recipeService)
        {
            _recipeService = recipeService;
        }

        // GET: api/<RecipeController>
        [HttpGet]
        public IEnumerable<RecipeDto> Get()
        {
            return _recipeService.GetList();
        }

        // GET api/<RecipeController>/catalog - public menu for customers
        [HttpGet("catalog")]
        [AllowAnonymous]
        public IEnumerable<RecipeCatalogDto> GetCatalog()
        {
            return _recipeService.GetCatalog();
        }

        // GET api/<RecipeController>/5
        [HttpGet("{id}")]
        public RecipeDto Get(int id)
        {
            return _recipeService.GetById(id);
        }

        // POST api/<RecipeController>
        [HttpPost]
        public async Task Post([FromBody] RecipeDto recipeDto)
        {
            await _recipeService.addAsync(recipeDto);
        }

        // PUT api/<RecipeController>/5
        [HttpPut("{id}")]
        public async Task Put(int id, [FromBody] RecipeDto recipeDto)
        {
            await _recipeService.updateAsync(id, recipeDto);
        }

        // DELETE api/<RecipeController>/5
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _recipeService.deleteAsync(id);
        }
    }
}
