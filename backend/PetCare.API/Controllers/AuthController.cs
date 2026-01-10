using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetCare.API.Data;
using PetCare.API.DTOs;
using PetCare.API.Models;
using System.Security.Cryptography;
using System.Text;

namespace PetCare.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AuthController(AppDbContext db)
        {
            _db = db;
        }

        // Alias: /api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
            => await RegisterUser(req);

        [HttpPost("register-user")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterRequest req)
        {
            if (req == null)
                return BadRequest(new { message = "Invalid payload." });

            var fullName = (req.FullName ?? "").Trim();
            var email = (req.Email ?? "").Trim().ToLower();
            var password = req.Password ?? "";

            if (string.IsNullOrWhiteSpace(fullName))
                return BadRequest(new { message = "FullName is required." });

            if (string.IsNullOrWhiteSpace(email))
                return BadRequest(new { message = "Email is required." });

            if (string.IsNullOrWhiteSpace(password))
                return BadRequest(new { message = "Password is required." });

            if (await _db.Users.AnyAsync(u => u.Email == email))
                return Conflict(new { message = "Email already exists." });

            var user = new User
            {
                FullName = fullName,
                Email = email,
                PasswordHash = HashPassword(password),
                Role = Roles.User,
                IsApproved = true
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok(new
            {
                user.Id,
                user.FullName,
                user.Email,
                user.Role,
                user.IsApproved
            });
        }

        [HttpPost("register-vet")]
        public async Task<IActionResult> RegisterVet([FromBody] RegisterRequest req)
        {
            if (req == null)
                return BadRequest(new { message = "Invalid payload." });

            var fullName = (req.FullName ?? "").Trim();
            var email = (req.Email ?? "").Trim().ToLower();
            var password = req.Password ?? "";

            if (string.IsNullOrWhiteSpace(fullName))
                return BadRequest(new { message = "FullName is required." });

            if (string.IsNullOrWhiteSpace(email))
                return BadRequest(new { message = "Email is required." });

            if (string.IsNullOrWhiteSpace(password))
                return BadRequest(new { message = "Password is required." });

            if (await _db.Users.AnyAsync(u => u.Email == email))
                return Conflict(new { message = "Email already exists." });

            var vet = new User
            {
                FullName = fullName,
                Email = email,
                PasswordHash = HashPassword(password),
                Role = Roles.Vet,
                IsApproved = false
            };

            _db.Users.Add(vet);
            await _db.SaveChangesAsync();

            return Ok(new
            {
                vet.Id,
                vet.FullName,
                vet.Email,
                vet.Role,
                vet.IsApproved,
                message = "Vet account created and pending admin approval."
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            if (req == null)
                return BadRequest(new { message = "Invalid payload." });

            var email = (req.Email ?? "").Trim().ToLower();
            var password = req.Password ?? "";

            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
                return BadRequest(new { message = "Email and Password are required." });

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                return Unauthorized(new { message = "Invalid email or password." });

            if (user.PasswordHash != HashPassword(password))
                return Unauthorized(new { message = "Invalid email or password." });

            if (user.Role == Roles.Vet && !user.IsApproved)
                return Unauthorized(new { message = "Your vet account is pending admin approval." });

            return Ok(new
            {
                user.Id,
                user.FullName,
                user.Email,
                user.Role,
                user.IsApproved
            });
        }

        [HttpPut("approve-vet/{id:int}")]
        public async Task<IActionResult> ApproveVet(int id)
        {
            var vet = await _db.Users.FirstOrDefaultAsync(u => u.Id == id && u.Role == Roles.Vet);

            if (vet == null)
                return NotFound(new { message = "Vet not found." });

            vet.IsApproved = true;
            await _db.SaveChangesAsync();

            return Ok(new
            {
                vet.Id,
                vet.FullName,
                vet.Email,
                vet.Role,
                vet.IsApproved
            });
        }

        private static string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToHexString(bytes);
        }
    }
}
