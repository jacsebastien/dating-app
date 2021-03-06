using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(Helpers.LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public UsersController(IDatingRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        // GET: api/users
        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var userFromRepo = await _repo.GetUser(currentUserId);

            userParams.UserId = currentUserId;

            if(string.IsNullOrEmpty(userParams.Gender))
            {
                // filter to the opposite gender of connected user
                userParams.Gender = userFromRepo.Gender == "male" ? "female" : "male";
            }

            var users = await _repo.GetPagedUsers(userParams);

            // Transform data to return thanks to Mapper and configured Dto to avoid sending ALL user data like password etc
            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);

            // add pagination infos in header
            Response.AddPagination(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(usersToReturn);
        }

        // GET: api/users/id
        [HttpGet("{id}", Name="GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);
            // Transform data to return thanks to Mapper and configured Dto
            var userToReturn = _mapper.Map<UserForDetailledDto>(user);

            return Ok(userToReturn);
        }

        // PUT: api/users/id
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserForUpdateDto userForUpdateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userFromRepo = await _repo.GetUser(id);

            if (userFromRepo == null)
            {
                // User $ to be able to put properties inside string
                return NotFound($"Could not find user with an ID of {id}");
            }

            // get the id of the current logged user thx to the Token sent in the header
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            
            // Compare with passed ID to verify if it's the right user 
            if (currentUserId != userFromRepo.Id)
            {
                return Unauthorized();
            }

            // Map into objects properties and update data of userFromRepo
            _mapper.Map(userForUpdateDto, userFromRepo);

            // if successfull save
            if(await _repo.SaveAll())
                return NoContent();

            // else
            throw new Exception($"Updating user {id} failled on save");
        }
    }
}