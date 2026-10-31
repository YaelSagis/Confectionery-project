using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Clean.Core.DTOs;
using Clean.Core.Entities;

namespace Clean.Core.Services
{
    public interface IRecipeService
    {
        public List<RecipeDto> GetList();
        public List<RecipeCatalogDto> GetCatalog();
        public RecipeDto GetById(int id);
        public Task addAsync(RecipeDto recipeDto);
        public Task updateAsync(int id, RecipeDto recipeDto);
        public Task deleteAsync(int id);
    }
}
