using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjP2M.Models;
using ProjP2M.Services;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using static ProjP2M.Services.UserService;

namespace ProjP2M.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService userService;

        public UserController(IUserService userService)
        {
            this.userService = userService ?? throw new ArgumentNullException(nameof(userService));
        }


        [AllowAnonymous]
        [HttpGet]
        public ActionResult<List<User>> GetUsers()
        {
            var users = userService.GetUsers();
            return Ok(users);
        }

        [AllowAnonymous]
        [HttpGet("email/{email}")]
        public ActionResult<User> GetUserByEmail(string email)
        {
            var user = userService.GetUserByEmail(email);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public ActionResult<User> GetUser(string id)
        {
            var user = userService.GetUser(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }
        [AllowAnonymous]
        [HttpPost("register")]
        public ActionResult<User> Register([FromBody] RegisterDTO registerDTO)
        {
            try
            {

                var newUser = new User
                {
                    FirstName = registerDTO.FirstName,
                    LastName = registerDTO.LastName,
                    Email = registerDTO.Email,
                    Password = registerDTO.Password, 
                    ImageUrl = registerDTO.ImageUrl
                };

                var createdUser = userService.CreateUser(newUser);
                if (createdUser == null)
                {
   
                    return StatusCode(500, "Internal Server Error: Unable to create user");
                }

                // Return a response indicating successful user creation
                return CreatedAtAction(nameof(GetUser), new { id = createdUser.Id }, createdUser);
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [AllowAnonymous]
        [Route("authenticate")]
        [HttpPost]
        public ActionResult<string> Login([FromBody] LoginDTO login)
        {
            var token = userService.Authenticate(login.Email, login.Password);
            if (token == null)
            {
                return Unauthorized();
            }
            return Ok(new { token }); // Wrap the token in an anonymous object and return Ok
        }



        [AllowAnonymous]
        [HttpPut("{id}/profile-image")]
        public IActionResult UpdateProfileImage(string id, [FromBody] ProfileImageDTO profileImageDTO)
        {
            if (profileImageDTO == null)
            {
                return BadRequest("Invalid request body.");
            }

            var existingUser = userService.GetUser(id);
            if (existingUser == null)
            {
                return NotFound();
            }

            existingUser.ImageUrl = profileImageDTO.ImageUrl;
            try
            {
                userService.UpdateUser(existingUser);
                return Ok(existingUser);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while updating the user's profile image.");
            }
        }

        [AllowAnonymous]
        [HttpPost("contact")]
        public async Task<IActionResult> ContactForm([FromBody] ContactMessage contactMessage)
        {
            if (contactMessage == null)
            {
                return BadRequest("Invalid request data");
            }

            try
            {
                using (var client = new SmtpClient("smtp.gmail.com"))
                {
                    client.Port = 587;
                    client.EnableSsl = true;
                    client.UseDefaultCredentials = false;

                    var credentials = new NetworkCredential("haddaremna30@gmail.com", "uitjjjpefuwhvjdh");
                    client.Credentials = credentials;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress("haddaremna30@gmail.com", "Dwira"),
                        Subject = "New Contact Form Submission",
                        Body = $"Username: {contactMessage.FullName}\nEmail: {contactMessage.Email}\nMessage: {contactMessage.Message}",
                        IsBodyHtml = false
                    };

                    mailMessage.To.Add("haddaremna30@gmail.com");
                    mailMessage.ReplyToList.Add(new MailAddress(contactMessage.Email, contactMessage.FullName));

                    await client.SendMailAsync(mailMessage);
                }

                return Ok("Contact message sent successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}
