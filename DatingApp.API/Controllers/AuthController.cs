using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    // api/auth
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        // get link to the repository used by this controller
        private readonly IAuthRepository _repo;
        public AuthController(IAuthRepository repo)
        {
            _repo = repo;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(string username, string password)
        {
            // TODO: validate request

            username = username.ToLower();

            if(await _repo.UserExists(username))
                return BadRequest("Username is already taken");

            var userToCreate = new User
            {
                Username = username
            };

            // Call the repository Register method to hash password and create a new user in DB 
            var createUser = await _repo.Register(userToCreate, password);

            return StatusCode(201);
        }
    }
}