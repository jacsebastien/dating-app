using System.Threading.Tasks;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    // Only specify the methods and the parameters needed
    public interface IAuthRepository
    {
        Task<User> Register(User user, string password);
        Task<User> Login(string username, string password);
        // Check if user exists before allowing him to register
        Task<bool> UserExists(string username);
    }
}