using Microsoft.AspNetCore.Mvc;
using SABApi.Models;
using SABApi.Services;

namespace SABApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<List<User>>> Get() =>
            Ok(await _userService.GetAsync());

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] User newUser)
        {
            var existingUser = await _userService.GetByUsernameAsync(newUser.Username);
            if (existingUser != null)
            {
                return BadRequest("Username is already taken.");
            }

            await _userService.CreateAsync(newUser);
            return Ok("User registered successfully.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User loginUser)
        {
            var user = await _userService.AuthenticateAsync(loginUser.Username, loginUser.Password);
            if (user == null)
            {
                return Unauthorized("Geçersiz kullanıcı adı veya şifre.");
            }

            var token = _userService.GenerateJwtToken(user);
            return Ok(new { Token = token, UserId = user.Id });
        }
    }
}