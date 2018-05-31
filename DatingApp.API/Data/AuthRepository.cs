using System;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        // Inject DataContext into the repository to be allowed to work with db
        private readonly DataContext _context;
        public AuthRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<User> Login(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Username == username);

            if(user == null)
                return null;

            if(!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;

            // auth successful
            return user;
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            // hash the sended password with stored salt ad copare it byte by byte to the stored hash of the user
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt)) {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

                for (int i = 0; i < computedHash.Length; i++) {
                    if(computedHash[i] != passwordHash[i])
                        return false;
                }
            }

            // if all bytes match
            return true;
        }

        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;
            // out allow to pass property by reference in place of value, no need of return
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            //Set up user hash and salt
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            // Add new user to the context
            await _context.Users.AddAsync(user);
            // Tells EntityFramework to save changes
            await _context.SaveChangesAsync();

            return user;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            // System.Security.Cryptography.HMACSHA512 in using statement to auto clean up memory after
            using (var hmac = new System.Security.Cryptography.HMACSHA512()) {
                // get the random generated Key used by System.Security.Cryptography to hash password
                passwordSalt = hmac.Key;
                // ComputeHash need Byte array for argument so convert string to Byte[]
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        public async Task<bool> UserExists(string username)
        {
            // If we found a corresponding username => user exists
            if(await _context.Users.AnyAsync(x => x.Username == username))
                return true;

            return false;
        }
    }
}