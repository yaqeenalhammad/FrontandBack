using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PetCare.API.Models
{
    public class LostPetPost
    {
        public int Id { get; set; }

        [Required, MaxLength(10)]
        public string PostType { get; set; } = "Lost"; 

        [Required, MaxLength(50)]
        public string TagId { get; set; } = "";

        [Range(0, 600)]
        public int AgeMonths { get; set; }

        [Required, MaxLength(120)]
        public string LastSeen { get; set; } = "";

        [Required, MaxLength(30)]
        public string PetType { get; set; } = ""; 

        [MaxLength(60)]
        public string? PetName { get; set; }

        [MaxLength(15)]
        public string? Gender { get; set; }

        [MaxLength(30)]
        public string? Color { get; set; }

        [Required, MaxLength(500)]
        public string Description { get; set; } = "";

        [MaxLength(40)]
        public string? City { get; set; }

        [MaxLength(40)]
        public string? Area { get; set; }

        [MaxLength(40)]
        public string? ContactPhone { get; set; }

        [MaxLength(40)]
        public string? Reward { get; set; }

        [MaxLength(25)]
        public string? LostDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<LostPetImage> Images { get; set; } = new();
    }
}
