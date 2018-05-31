﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        // Get access to a context to communicate with the DB inside controller
        private readonly DataContext _context;
        public ValuesController(DataContext context)
        {
            _context = context;

        }

        // GET api/values
        // Use IActionResult to return a HTTP response
        [HttpGet]
        public IActionResult GetValues()
        {
            // get all values in Values table to a list
            var values = _context.Values.ToList();
            return Ok(values);
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public IActionResult GetValue(int id)
        {
            // get the first matching value or null
            var value = _context.Values.FirstOrDefault(x => x.Id == id);
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
