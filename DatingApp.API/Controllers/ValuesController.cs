using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Controllers
{
    // Force authentication to get access to  methods
    // Need to be configured in Startup.cs
    [Authorize]
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        // Get access to a context to communicate with the DB inside controller
        private readonly DataContext _context;
        public ValuesController(DataContext context)
        {
            _context = context;

        }

        // No need of authentication for this one
        // [AllowAnonymous]
        // GET api/values
        [HttpGet]
        // Use Task<IActionResult> to return a HTTP response in asynchrone mode
        public async Task<IActionResult> GetValues()
        {
            // get all values in Values table to a list
            var values =  await _context.Values.ToListAsync();
            return Ok(values);
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetValue(int id)
        {
            // get the first matching value or null
            var value = await _context.Values.FirstOrDefaultAsync(x => x.Id == id);
            return Ok(value);
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
