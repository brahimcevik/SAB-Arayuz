using Microsoft.AspNetCore.Mvc;
using SABApi.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace SABApi.Controllers
{
    public class WeatherController : ControllerBase
    {
        private readonly WeatherService _weatherService;

        public WeatherController(WeatherService weatherService)
        {
            _weatherService = weatherService;
        }

        [HttpGet("get-coordinates")]
        public async Task<IActionResult> GetCoordinates([FromQuery] string cityName)
        {
            if (string.IsNullOrWhiteSpace(cityName))
            {
                return BadRequest("Şehir adı boş olamaz.");
            }

            var coordinates = await _weatherService.GetCoordinatesAsync(cityName);

            if (coordinates == null)
            {
                return NotFound("Şehir bulunamadı veya bir hata oluştu.");
            }

            return Ok(new
            {
                city = cityName,
                latitude = coordinates.Latitude,
                longitude = coordinates.Longitude
            });
        }
    }

}



