namespace WeatherDashboard.Services
{
    using Newtonsoft.Json;
    using WeatherDashboard.Models;

    public class WeatherBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IHttpClientFactory _httpClientFactory;

        public WeatherBackgroundService(IServiceProvider serviceProvider, IHttpClientFactory httpClientFactory)
        {
            _serviceProvider = serviceProvider;
            _httpClientFactory = httpClientFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await FetchWeatherDataAsync();
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }

        private async Task FetchWeatherDataAsync()
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<WeatherDbContext>();
            var httpClient = _httpClientFactory.CreateClient();

            // Add your weather API URL and key here
            string apiUrl = "https://api.openweathermap.org/data/2.5/weather";
            string[] cities = { "London,uk", "New York,us" };
            string apiKey = "e51db92d354757b725d4682ce4ee0463";

            foreach (var city in cities)
            {
                var response = await httpClient.GetStringAsync($"{apiUrl}?q={city}&appid={apiKey}");
                var weatherData = JsonConvert.DeserializeObject<WeatherApiResponse>(response);

                var cityWeather = new CityWeather
                {
                    Country = weatherData.Sys.Country,
                    City = weatherData.Name,
                    Temperature = weatherData.Main.Temp,
                    LastUpdateTime = DateTime.UtcNow
                };

                context.CityWeathers.Add(cityWeather);
                await context.SaveChangesAsync();
            }
        }
    }

    public class WeatherApiResponse
    {
        public Main Main { get; set; }
        public Sys Sys { get; set; }
        public string Name { get; set; }
    }

    public class Main
    {
        public double Temp { get; set; }
    }

    public class Sys
    {
        public string Country { get; set; }
    }

}
