using Microsoft.AspNetCore.Mvc;

namespace PetCare.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssetsController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public AssetsController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpGet("images")]
        public IActionResult GetAllImages()
        {
            var imagesRoot = Path.Combine(_env.WebRootPath, "images");
            if (!Directory.Exists(imagesRoot))
                return Ok(Array.Empty<object>());

            var allowed = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            { ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg" };

            var files = Directory.EnumerateFiles(imagesRoot, "*.*", SearchOption.AllDirectories)
                .Where(f => allowed.Contains(Path.GetExtension(f)))
                .Select(fullPath =>
                {
                    var rel = Path.GetRelativePath(_env.WebRootPath, fullPath).Replace("\\", "/");
                    var url = $"{Request.Scheme}://{Request.Host}/{rel}";
                    return new { name = Path.GetFileName(fullPath), path = "/" + rel, url };
                })
                .OrderBy(x => x.path)
                .ToList();

            return Ok(files);
        }
    }
}
