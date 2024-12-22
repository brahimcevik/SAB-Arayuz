
using SABApi.Models;
using System.Text.Json;
using System.Net.Http;
using System.Threading.Tasks;


namespace SABApi.Services
{
    public class WeatherService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey = "0c0dcdc7e9b2975a7e115ed4ec2ae3ab"; // OpenWeatherMap API anahtarı

        public WeatherService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<CityCoordinates> GetCoordinatesAsync(string cityName)
        {
            // OpenWeatherMap Geocoding API Endpoint
            var url = $"http://api.openweathermap.org/geo/1.0/direct?q={cityName}&limit=1&appid={_apiKey}";

            try
            {
                var response = await _httpClient.GetAsync(url);

                if (response.IsSuccessStatusCode)
                {
                    var jsonString = await response.Content.ReadAsStringAsync();

                    // JSON'dan koordinatları parse et
                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                    var data = JsonSerializer.Deserialize<CityGeocodeResponse[]>(jsonString, options);

                    if (data != null && data.Length > 0)
                    {
                        return new CityCoordinates
                        {
                            Latitude = data[0].Lat,
                            Longitude = data[0].Lon
                        };
                    }
                }
                return null;
            }
            catch
            {
                return null;
            }
        }

        // JSON'daki response için sınıf tanımı
        private class CityGeocodeResponse
        {
            public double Lat { get; set; }
            public double Lon { get; set; }
        }
    }
}