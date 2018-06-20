using System;

namespace DatingApp.API.Models
{
    public class Photo
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public bool IsMain { get; set; }

        public string PublicId { get; set; }

        // With User keys in Photo Class, force EntityFramework to use Cascading deletion (If user is deleted, all photos are deleted) 
        // in place of Restrict deletion (Delete user, keep photos and set UserId to null)
        public User User { get; set; }
        public int UserId { get; set; }
    }
}