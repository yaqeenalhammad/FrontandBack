using System.ComponentModel.DataAnnotations;

namespace PetCare.API.Models
{
    public class LostPetImage
    {
        public int Id { get; set; }

        public int LostPetPostId { get; set; }
        public LostPetPost? LostPetPost { get; set; }

        [Required, MaxLength(300)]
        public string Url { get; set; } = string.Empty;
    }
}
