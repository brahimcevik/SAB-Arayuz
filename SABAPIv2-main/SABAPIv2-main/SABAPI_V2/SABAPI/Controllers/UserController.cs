using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver.Core.Authentication;
using SABApi.Models;
using SABApi.Services;

namespace SABApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly WeatherService _weatherService;

        public UserController(UserService userService, WeatherService weatherService)
        {
            _userService = userService;
            _weatherService = weatherService;
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

            // Kullanıcının şehir bilgisi alınıyor
            var cityName = user.City;
            if (string.IsNullOrWhiteSpace(cityName))
            {
                return BadRequest("Kullanıcıya atanmış bir şehir bulunamadı.");
            }

            var coordinates = await _weatherService.GetCoordinatesAsync(cityName);
            if (coordinates == null)
            {
                return NotFound("Şehir bilgisi bulunamadı.");
            }

            return Ok(new
            {
                Token = token,
                UserId = user.Id,
                City = cityName,
                UserName = user.Username,
                FirstName = user.Profile.FirstName,
                LastName = user.Profile.LastName,
                Email = user.Profile.Email,
                Phone = user.Profile.Phone,
                ProfilePicture = user.Profile.ProfilePicture,
                Ulke = user.Profile.Ulke,
                Roles = user.Roles,
                Coordinates = new
                {
                    Latitude = coordinates.Latitude,
                    Longitude = coordinates.Longitude
                }
            });
        }
        [HttpPatch("update-city/{userId}")]
        public async Task<IActionResult> UpdateCity(string userId, [FromBody] string newCity)
        {
            if (string.IsNullOrWhiteSpace(newCity))
            {
                return BadRequest("Geçerli bir şehir adı girin.");
            }

            var user = await _userService.GetByIdAsync(userId); // GetByIdAsync metodunu kullanıyoruz

            if (user == null)
            {
                return NotFound("Kullanıcı bulunamadı.");
            }

            // Şehir bilgisini güncelle
            user.City = newCity;

            // Kullanıcıyı veritabanında güncelle
            await _userService.UpdateUserAsync(user);

            // Şehir koordinatlarını al
            var coordinates = await _weatherService.GetCoordinatesAsync(newCity);
            if (coordinates == null)
            {
                return NotFound("Şehir bilgisi bulunamadı.");
            }

            return Ok(new
            {
                Message = "Şehir başarıyla güncellendi.",
                City = newCity,
                Coordinates = new
                {
                    Latitude = coordinates.Latitude,
                    Longitude = coordinates.Longitude
                }
            });
        }
        [HttpGet("profile/{userId}")]
        public async Task<IActionResult> GetProfile(string userId)
        {
            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
            {
                return NotFound("Kullanıcı bulunamadı.");
            }

            return Ok(user.Profile);
        }
        [HttpPut("profile/{userId}")]
        public async Task<IActionResult> UpdateProfile(string userId, [FromBody] Profile updatedProfile)
        {
            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
            {
                return NotFound("Kullanıcı bulunamadı.");
            }

            user.Profile = updatedProfile;
            await _userService.UpdateUserAsync(user);

            return Ok("Profil başarıyla güncellendi.");
        }

        [HttpPost("profile/{userId}")]
        public async Task<IActionResult> CreateProfile(string userId, [FromBody] Profile newProfile)
        {
            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
            {
                return NotFound("Kullanıcı bulunamadı.");
            }

            user.Profile = newProfile;
            await _userService.UpdateUserAsync(user);

            return Ok("Profil başarıyla oluşturuldu.");
        }


        [HttpPatch("{userId}")]
        public async Task<IActionResult> UpdateUserFields(string userId, [FromBody] User updatedFields)
        {
            if (updatedFields == null)
            {
                return BadRequest("No fields provided for update.");
            }

            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Sadece değiştirilen alanları güncelle
            await _userService.UpdateUserAsync(updatedFields);

            return Ok(new
            {
                Message = "User updated successfully",
                UpdatedUser = updatedFields
            });
        }







    }
}