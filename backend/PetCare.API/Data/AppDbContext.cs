using Microsoft.EntityFrameworkCore;
using PetCare.API.Models;

namespace PetCare.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } = default!;
        public DbSet<LostPetPost> LostPetPosts { get; set; } = default!;
        public DbSet<LostPetImage> LostPetImages { get; set; } = default!;
    }
}
