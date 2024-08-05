namespace WeatherDashboard.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using WeatherDashboard.Database;

    [ApiController]
    [Route("api/[controller]")]
    public class WeatherController : ControllerBase
    {
        private readonly WeatherDbContext _context;

        public WeatherController(WeatherDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCityWeathers()
        {
            var cityWeathers = await _context.CityWeathers
                .OrderByDescending(cw => cw.LastUpdateTime)
                .ToListAsync();
            return Ok(cityWeathers);
        }
    }
}
