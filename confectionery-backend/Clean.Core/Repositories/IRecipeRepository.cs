using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Clean.Core.Entities;

namespace Clean.Core.Repositories
{
    public interface IRecipeRepository
    {
        public List<Recipe> GetAll();
        public Recipe GetById(int id);
        public Task postAsync(Recipe recipe);
        public Task putAsync(int id, Recipe recipe);
        public Task deleteAsync(int id);
    }
}
