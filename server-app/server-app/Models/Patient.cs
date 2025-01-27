using System.ComponentModel.DataAnnotations;

namespace server_app.Models
{
    public class Patient : User
    {
        [Required]
        public DateOnly BirthDate { get; set; }

        [Required]
        public Gender Gender { get; set; }

        public BloodType BloodType { get; set; }

        public string Address { get; set; } = string.Empty;
    }

    public enum Gender
    {
        Male,
        Female,
        Other
    }

    public enum BloodType
    {
        A_Positive = 1,
        A_Negative = 2,
        B_Positive = 3,
        B_Negative = 4,
        AB_Positive = 5,
        AB_Negative = 6,
        O_Positive = 7,
        O_Negative = 8
    }
}
