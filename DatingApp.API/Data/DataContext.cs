using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DataContext : DbContext
    {
        // Pass DbContextOptions type of DataContext to a base constructor
        public DataContext(DbContextOptions<DataContext> options) : base(options) {}

        // Tell the datacontext about the models by settings properties
        // <Value> (model name), Values = name of the table
        public DbSet<Value> Values { get; set; }
    }
}