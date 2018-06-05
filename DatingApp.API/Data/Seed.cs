using System.Collections.Generic;
using DatingApp.API.Models;
using Newtonsoft.Json;

namespace DatingApp.API.Data
{
    public class Seed
    {
        private readonly DataContext _context;
        public Seed(DataContext context)
        {
            _context = context;

        }

        public void SeedUsers()
        {
            // Remove all users that are already in database
            _context.Users.RemoveRange(_context.Users);
            _context.SaveChanges();

            // Seed Users
            var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");
            // Parse string to a List of type User
            var users = JsonConvert.DeserializeObject<List<User>>(userData);

            foreach (var user in users)
            {
                // Create the password hash
                byte[] passwordHash, passwordSalt;
                // CF AuthRepository
                CreatePasswordHash("password", out passwordHash, out passwordSalt);

                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
                user.Username = user.Username.ToLower();

                _context.Users.Add(user);
            }

            _context.SaveChanges();
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            // System.Security.Cryptography.HMACSHA512 in using statement to auto clean up memory after
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                // get the random generated Key used by System.Security.Cryptography to hash password
                passwordSalt = hmac.Key;
                // ComputeHash need Byte array for argument so convert string to Byte[]
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}