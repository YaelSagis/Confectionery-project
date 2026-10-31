using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Clean.Core.Entities;
using Clean.Core.Repositories;

namespace Clean.Data.Repositories
{
    public class RecipeRepository:IRecipeRepository
    {
        private readonly DataContext _dataContext;

        public RecipeRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public List<Recipe> GetAll()
        {
            return _dataContext.recipes.ToList();
        }
        public Recipe GetById(int id)
        {
            return _dataContext.recipes.Find(id);
        }
        public async Task postAsync(Recipe recipe)
        {
            _dataContext.recipes.Add(recipe);
            await _dataContext.SaveChangesAsync();
        }
        public async Task putAsync(int id, Recipe recipe)
        {
            Recipe r = _dataContext.recipes.Find(id);
            if (r != null)
            {
                r.name = recipe.name;
                r.prepTime= recipe.prepTime;
                r.difficulty= recipe.difficulty;
                r.price = recipe.price;
                r.description = recipe.description;
                r.imageUrl = recipe.imageUrl;
                r.ingredients = recipe.ingredients;
                r.instructions = recipe.instructions;
                await _dataContext.SaveChangesAsync();
            }
        }
        public async Task deleteAsync(int id)
        {
            Recipe r = _dataContext.recipes.Find(id);
            if (r != null)
            {
                _dataContext.recipes.Remove(r);
                await _dataContext.SaveChangesAsync();
            }
        }
    }
}
