using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetCare.API.Data;
using PetCare.API.DTOs;
using PetCare.API.Models;

namespace PetCare.API.Controllers
{
    [ApiController]
    [Route("api/lost-pets")]
    public class LostPetsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;

        public LostPetsController(AppDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var posts = await _db.LostPetPosts
                .Include(p => p.Images)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new
                {
                    p.Id,
                    p.PostType,
                    p.TagId,
                    p.AgeMonths,
                    p.LastSeen,
                    p.PetType,
                    p.PetName,
                    p.Gender,
                    p.Color,
                    p.Description,
                    p.City,
                    p.Area,
                    p.ContactPhone,
                    p.Reward,
                    p.LostDate,
                    p.CreatedAt,
                    imageUrls = p.Images.Select(i => i.Url).ToList()
                })
                .ToListAsync();

            return Ok(posts);
        }

        [HttpGet("{tagId}")]
        public async Task<IActionResult> GetByTagId(string tagId)
        {
            var post = await _db.LostPetPosts
                .Include(p => p.Images)
                .Where(p => p.TagId == tagId)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new
                {
                    p.Id,
                    p.PostType,
                    p.TagId,
                    p.AgeMonths,
                    p.LastSeen,
                    p.PetType,
                    p.PetName,
                    p.Gender,
                    p.Color,
                    p.Description,
                    p.City,
                    p.Area,
                    p.ContactPhone,
                    p.Reward,
                    p.LostDate,
                    p.CreatedAt,
                    imageUrls = p.Images.Select(i => i.Url).ToList()
                })
                .FirstOrDefaultAsync();

            if (post == null) return NotFound(new { message = "Not found" });
            return Ok(post);
        }

        [HttpPost]
        [RequestSizeLimit(10_000_000)]
        public async Task<IActionResult> Create([FromForm] CreateLostPetPostRequest req)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { message = "Validation failed", errors = ModelState });

            var post = new LostPetPost
            {
                PostType = req.PostType,
                TagId = req.TagId.Trim(),
                AgeMonths = req.AgeMonths,
                LastSeen = req.LastSeen.Trim(),
                PetType = req.PetType.Trim(),
                PetName = string.IsNullOrWhiteSpace(req.PetName) ? null : req.PetName.Trim(),
                Gender = string.IsNullOrWhiteSpace(req.Gender) ? null : req.Gender.Trim(),
                Color = string.IsNullOrWhiteSpace(req.Color) ? null : req.Color.Trim(),
                Description = req.Description.Trim(),
                City = string.IsNullOrWhiteSpace(req.City) ? null : req.City.Trim(),
                Area = string.IsNullOrWhiteSpace(req.Area) ? null : req.Area.Trim(),
                ContactPhone = string.IsNullOrWhiteSpace(req.ContactPhone) ? null : req.ContactPhone.Trim(),
                Reward = string.IsNullOrWhiteSpace(req.Reward) ? null : req.Reward.Trim(),
                LostDate = string.IsNullOrWhiteSpace(req.LostDate) ? null : req.LostDate.Trim(),
            };

            // حفظ الصور في wwwroot/uploads/lostpets
            if (req.Images != null && req.Images.Count > 0)
            {
                var uploadsDir = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads", "lostpets");
                Directory.CreateDirectory(uploadsDir);

                foreach (var file in req.Images.Where(f => f.Length > 0))
                {
                    var ext = Path.GetExtension(file.FileName);
                    var name = $"{Guid.NewGuid():N}{ext}";
                    var fullPath = Path.Combine(uploadsDir, name);

                    using var stream = System.IO.File.Create(fullPath);
                    await file.CopyToAsync(stream);

                    post.Images.Add(new LostPetImage
                    {
                        Url = $"/uploads/lostpets/{name}"
                    });
                }
            }

            _db.LostPetPosts.Add(post);
            await _db.SaveChangesAsync();

            return Ok(new
            {
                post.Id,
                post.PostType,
                post.TagId,
                post.AgeMonths,
                post.LastSeen,
                post.PetType,
                post.PetName,
                post.Gender,
                post.Color,
                post.Description,
                post.City,
                post.Area,
                post.ContactPhone,
                post.Reward,
                post.LostDate,
                post.CreatedAt,
                imageUrls = post.Images.Select(i => i.Url).ToList()
            });
        }
    }
}
