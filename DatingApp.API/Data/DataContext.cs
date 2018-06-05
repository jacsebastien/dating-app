using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    // Used to generate Tables in DB
    public class DataContext : DbContext
    {
        // Pass DbContextOptions type of DataContext to a base constructor
        public DataContext(DbContextOptions<DataContext> options) : base(options) {}

        // Tell the datacontext about the models by settings properties
        // <Value> (model name), Values = name of the table
        public DbSet<Value> Values { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
    }
}