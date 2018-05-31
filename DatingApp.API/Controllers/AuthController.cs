using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
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
        // Use a Dto to define the format of data passed to the method from the http call
        // Need [FromBody] with Dtos tu tells the API where to search for data
        public async Task<IActionResult> Register([FromBody]UserForRegisterDto userForRegisterDto)
        {
            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();

            // Check if username exists and adapt ModelState of DTO if needed
            if(await _repo.UserExists(userForRegisterDto.Username))
                ModelState.AddModelError("Username", "Username already exists");

            // if sended data dont pass the validation of DTO or if user exists
            if(!ModelState.IsValid)
                return BadRequest(ModelState);


            var userToCreate = new User
            {
                Username = userForRegisterDto.Username
            };

            // Call the repository Register method to hash password and create a new user in DB 
            var createUser = await _repo.Register(userToCreate, userForRegisterDto.Password);

            return StatusCode(201);
        }
    }
}