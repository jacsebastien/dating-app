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
            var photoFromRepo = await _repo.GetPhoto(id);

            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);

            return Ok(photo);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, PhotoForCreationDto photoDto)
        {
            var user = await _repo.GetUser(userId);

            if(user == null)
                return BadRequest("Could not find user");

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            if(currentUserId != user.Id)
                return Unauthorized();

            var file = photoDto.File;

            // Create an object to recieve response from Cloudinary after upload
            var uploadResult = new ImageUploadResult();

            if(file.Length > 0)
            {
                // Read in memory uploaded file content and upload it to cloudinary
                using (var stream = file.OpenReadStream())
                {
                    // Crop the image to fit maximum size around the face of the person and upload it to cloudinary
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };

                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            if(uploadResult.Uri == null || uploadResult.PublicId == null)
                return BadRequest("Could not upload the photo");

            // Store result from cloudinary after upload
            photoDto.Url = uploadResult.Uri.ToString();
            photoDto.PublicId = uploadResult.PublicId;

            // Create a photo object from model with uploaded data and corresponding user
            var photo = _mapper.Map<Photo>(photoDto);
            photo.User = user;

            // Set uploaded photo as main photo if no one exists
            if(!user.Photos.Any(m => m.IsMain))
                photo.IsMain = true;

            // Store data in model
            user.Photos.Add(photo);

            // If save is success, return the uploaded photo to user. (details of photo)
            if(await _repo.SaveAll())
            {
                var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
                // Use GetPhoto route to retrieve data to send back to user
                return CreatedAtRoute("GetPhoto", new { id =  photo.Id }, photoToReturn);
            }

            return BadRequest("Could not add the photo");
        }

        [HttpPost("{photoId}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int photoId)
        {
            var user = await _repo.GetUser(userId);

            if(user == null)
                return BadRequest("Could not find user");

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            if(currentUserId != user.Id)
                return Unauthorized();

            // check if photoId match with one of the user's photos
            if(!user.Photos.Any(p => p.Id == photoId))
                return Unauthorized();

            var photoFromRepo = await _repo.GetPhoto(photoId);

            if(photoFromRepo == null)
                return NotFound();

            if(photoFromRepo.IsMain)
                return BadRequest("Already the main photo");

            var currenMainPhoto = await _repo.GetMainPhoto(userId);

            if(currenMainPhoto != null)
                currenMainPhoto.IsMain = false;

            photoFromRepo.IsMain = true;

            if(await _repo.SaveAll())
                return NoContent();     // 200

            return BadRequest("Could not set photo to main");
        }

        [HttpDelete("{photoId}")]
        public async Task<IActionResult> DeletePhoto(int photoId, int userId)
        {
            var user = await _repo.GetUser(userId);

            if(user == null)
                return BadRequest("Could not find user");

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            if(currentUserId != user.Id)
                return Unauthorized();

            // check if photoId match with one of the user's photos
            if(!user.Photos.Any(p => p.Id == photoId))
                return Unauthorized();

            var photoFromRepo = await _repo.GetPhoto(photoId);

            if(photoFromRepo == null)
                return NotFound();

            if(photoFromRepo.IsMain)
                return BadRequest("You cannot delete the main photo");

            // Delete from cloudinary if we have a public id then delete from repo
            if(photoFromRepo.PublicId != null) 
            {
                var deleteParams = new DeletionParams(photoFromRepo.PublicId);

                var result = _cloudinary.Destroy(deleteParams);

                if(result.Result == "ok")
                    _repo.Delete(photoFromRepo);
            } 
            else 
            {
                _repo.Delete(photoFromRepo);
            }
            
            if(await _repo.SaveAll())
                return Ok();

            return BadRequest("Failed to delete the photo");
        }
    }
}