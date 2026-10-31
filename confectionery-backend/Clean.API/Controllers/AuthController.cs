using Clean.Service;
using Microsoft.AspNetCore.Mvc;

namespace Clean.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly JwtService _jwtService;

        public AuthController(JwtService jwtService)
        {
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public IActionResult LogIn([FromBody] LoginModel login)
        {
            if(login.UserName == "test" && login.Password == "password")
            {
                var token = _jwtService.GenerateToken(login.UserName);
                return Ok(token);
            }
            return Unauthorized();
        }
    }

    public class LoginModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}
