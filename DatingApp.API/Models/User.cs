namespace DatingApp.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        //Hash and salt are stored into bytes array
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
    }
}