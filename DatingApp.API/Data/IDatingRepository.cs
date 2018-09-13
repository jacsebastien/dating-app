using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    public interface IDatingRepository
    {
        // Generic Add method that can tak different types of arguments (User, Photo, ...)
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        // Async methot that return a boolean
        Task<bool> SaveAll();
        Task<IEnumerable<User>> GetUsers();
        Task<PagedList<User>> GetPagedUsers(UserParams userParams);
        Task<User> GetUser(int id);
        Task<Photo> GetPhoto(int id);
        Task<Photo> GetMainPhoto(int userId);
    }
}