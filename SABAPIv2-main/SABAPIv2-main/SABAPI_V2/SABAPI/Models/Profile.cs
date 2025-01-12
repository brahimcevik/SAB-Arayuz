namespace SABApi.Models
{
    public class Profile
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string ProfilePicture { get; set; } = string.Empty; // Base64 olarak saklanabilir
        public string Ulke { get; set; } = string.Empty;
    }
}
