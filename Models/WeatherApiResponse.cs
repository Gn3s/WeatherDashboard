namespace WeatherDashboard.Models
{
    public class WeatherApiResponse
    {
        public Main Main { get; set; }
        public Sys Sys { get; set; }
        public string Name { get; set; }
    }
}
