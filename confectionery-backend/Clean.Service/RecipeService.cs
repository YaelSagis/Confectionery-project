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
    public class RecipeService:IRecipeService
    {
        private readonly IRecipeRepository _recipeRepository;
        private readonly IMapper _mapper;
        public RecipeService(IRecipeRepository recipeRepository, IMapper mapper)
        {
            _recipeRepository = recipeRepository;
            _mapper = mapper;
        }

        public List<RecipeDto> GetList()
        {
            //TODO business logic
            var recipe = _recipeRepository.GetAll();
            return _mapper.Map<List<RecipeDto>>(recipe);
        }
        public List<RecipeCatalogDto> GetCatalog()
        {
            var recipe = _recipeRepository.GetAll();
            return _mapper.Map<List<RecipeCatalogDto>>(recipe);
        }
        public RecipeDto GetById(int id)
        {
            var recipe = _recipeRepository.GetById(id);
            return _mapper.Map<RecipeDto>(recipe);
        }
        public async Task addAsync(RecipeDto recipeDto)
        {
            var recipe = _mapper.Map<Recipe>(recipeDto);
            await _recipeRepository.postAsync(recipe);
        }
        public async Task updateAsync(int id, RecipeDto recipeDto)
        {
            var recipe = _mapper.Map<Recipe>(recipeDto);
            await _recipeRepository.putAsync(id, recipe);
        }
        public async Task deleteAsync(int id)
        {
            await _recipeRepository.deleteAsync(id);
        }
    }
}
