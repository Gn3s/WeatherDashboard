namespace WeatherDashboard
{
    using Microsoft.EntityFrameworkCore;
    using WeatherDashboard.Models;

    public class WeatherDbContext : DbContext
    {
        public DbSet<CityWeather> CityWeathers { get; set; }

        public WeatherDbContext(DbContextOptions<WeatherDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
