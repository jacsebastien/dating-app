using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Get Token key from appsettings.json accessible from Configuration
            var key = Encoding.ASCII.GetBytes(Configuration.GetSection("AppSettings:Token").Value);

            // configure the database used to be Sequel lite
            // Use the ConnexionString setup in appsettings.json accessible from Configuration property
            services.AddDbContext<DataContext>(x => x.UseSqlite(Configuration.GetConnectionString("DefaultConnexion")));
            // Add Custom Sed service to populate Database
            services.AddTransient<Seed>();

            // allow to manage cors for cross domains calls
            services.AddCors();

            // Implements repositories to access it's methods
            // AddScoped to call it each time an http request is done
            // Good place to test env and use one repository or another in function of Prod/Dev
            services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped<IDatingRepository, DatingRepository>();

            // Configure authentication for JWT
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options => {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            services.AddMvc().AddJsonOptions(opt => {
                // Ignore self referencing loop in json serialisation to avoid errors for infinity loop
                opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });            
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, Seed seeder)
        {
            // Show detailled error message on dev env
            if (env.IsDevelopment())
            {
                // Show complete detailled error message on dev mode
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // Show more user friendly error message on prod mode (default is just the error code)
                app.UseExceptionHandler(builder => {
                    // Execute builder middleware to configure error message
                    builder.Run(async context => {
                        // Set the status code of the http call to 500 for global exception handler
                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                        // Get the error
                        var error = context.Features.Get<IExceptionHandlerFeature>();

                        // return only the error message without all the details
                        if(error!= null)
                        {
                            context.Response.AddApplicationError(error.Error.Message);
                            await context.Response.WriteAsync(error.Error.Message);
                        }
                    });
                });
            }

            // Populate Database with custom Seed class
            // seeder.SeedUsers();
            // Configure cors to allow all
            // Need to be set BEFORE UseMvc to set headers Before the request is handled by controllers
            app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().AllowCredentials());
            app.UseAuthentication();
            // handle the requests by controllers
            app.UseMvc();   
        }
    }
}
