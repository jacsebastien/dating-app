using System.Linq;
using AutoMapper;
using DatingApp.API.Dtos;
using DatingApp.API.Models;

namespace DatingApp.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDto>()
                // Set the PhotoUrl to the Url property of the first match photo with IsMain property = true
                .ForMember(
                    dest => dest.PhotoUrl, 
                    opt => {
                        opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
                    }
                )
                // Use custom method CalculateAge() and store it in Age property of User
                .ForMember(
                    dest => dest.Age,
                    opt => {
                        opt.ResolveUsing(d => d.DateOfBirth.CalculateAge());
                    }
                );

            CreateMap<User, UserForDetailledDto>()
                .ForMember(
                    dest => dest.PhotoUrl, 
                    opt => {
                        opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
                    }
                )
                .ForMember(
                    dest => dest.Age,
                    opt => {
                        opt.ResolveUsing(d => d.DateOfBirth.CalculateAge());
                    }
                );

            CreateMap<Photo, PhotosForDetailledDto>();

            CreateMap<UserForUpdateDto, User>();
        }
    }
}