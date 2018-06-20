using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/[controller]")]
    public class PhotosController : Controller
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _couludinaryConfig;
        private Cloudinary _cloudinary;

        public PhotosController(
            IDatingRepository repo,
            IMapper mapper,
            IOptions<CloudinarySettings> couludinaryConfig)
        {
            _mapper = mapper;
            _couludinaryConfig = couludinaryConfig;
            _repo = repo;

            Account acc = new Account(
                _couludinaryConfig.Value.CloudName,
                _couludinaryConfig.Value.ApiKey,
                _couludinaryConfig.Value.ApiSecret
            );

            // Allow to use methods to access cloudinary account
            _cloudinary = new Cloudinary(acc);
        }

        // Give a name to the route to be able to use it in another method
        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo =  _repo.GetPhoto(id);

            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);

            return Ok(photo);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, PhotoForCreationDto photoDto)
        {
            var user = await _repo.GetUser(userId);

            if (user == null)
                return BadRequest("Could not find user");

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            if (currentUserId != user.Id)
                return Unauthorized();

            var file = photoDto.File;

            // Create an object to recieve response from Cloudinary after upload
            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                // read in memory uploaded files content and upload them to cloudinary
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream)
                    };

                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            // store result from cloudinary after upload
            photoDto.Url = uploadResult.Uri.ToString();
            photoDto.PublicId = uploadResult.PublicId;

            // Create a photo object from model with uploaded data and corresponding user
            var photo = _mapper.Map<Photo>(photoDto);
            photo.User = user;

            // Set uploaded photo as main photo if no one exists
            if (!user.Photos.Any(m => m.IsMain))
                photo.IsMain = true;

            // Store data in model
            user.Photos.Add(photo);

            // If save is success, return the uploaded photo to user. (details of photo)
            if (await _repo.SaveAll())
            {
                var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
                // Use GetPhoto route to retrieve data to send back to user
                return CreatedAtRoute("GetPhoto", new { id =  photo.Id }, photoToReturn);
            }

            return BadRequest("Could not add the photo");
        }
    }
}