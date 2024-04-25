using Microsoft.AspNetCore.Mvc;
using Moq;
using ProjP2M.Controllers;
using ProjP2M.Models;
using ProjP2M.Services;
using System.Collections.Generic;
using Xunit;

namespace ProjP2M.Tests.Controllers
{
    public class UserControllerTests
    {
        [Fact]
        public void GetUsers_ReturnsListOfUsers()
        {
            // Arrange
            var userServiceMock = new Mock<IUserService>();
            var controller = new UserController(userServiceMock.Object);

            // Setup mock to return a non-null list of users
            userServiceMock.Setup(service => service.GetUsers()).Returns(new List<User>());

            // Act
            ActionResult<List<User>> result = controller.GetUsers();

            // Assert
            Assert.NotNull(result); // Check if the result is not null
            Assert.IsType<OkObjectResult>(result.Result); // Check if the result is an OkObjectResult
        }

        [Fact]
        public void GetUserByEmail_ReturnsUser_WhenFound()
        {
            // Arrange
            var email = "test@example.com";
            var user = new User { Email = email };
            var userServiceMock = new Mock<IUserService>();
            userServiceMock.Setup(service => service.GetUserByEmail(email)).Returns(user);
            var controller = new UserController(userServiceMock.Object);

            // Act
            var result = controller.GetUserByEmail(email);

            // Assert
            Assert.NotNull(result); // Check if the result is not null
            var okResult = Assert.IsType<OkObjectResult>(result.Result); // Check if the result is an OkObjectResult
            Assert.Equal(user, okResult.Value); // Check if the returned user is the expected one
        }
        [Fact]
        public void Register_ReturnsCreatedAtAction_WithValidModel()
        {
            // Arrange
            var registerDTO = new RegisterDTO
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                Password = "password",
                ImageUrl = "https://example.com/image.jpg"
            };

            var expectedUser = new User
            {
                Id = "1",
                FirstName = registerDTO.FirstName,
                LastName = registerDTO.LastName,
                Email = registerDTO.Email,
                ImageUrl = registerDTO.ImageUrl
            };

            var userServiceMock = new Mock<IUserService>();
            userServiceMock.Setup(service => service.CreateUser(It.IsAny<User>()))
                           .Returns(expectedUser);

            var controller = new UserController(userServiceMock.Object);

            // Act
            var result = controller.Register(registerDTO);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var user = Assert.IsType<User>(createdAtActionResult.Value);
            Assert.Equal(expectedUser.Id, user.Id);
            Assert.Equal(expectedUser.FirstName, user.FirstName);
            Assert.Equal(expectedUser.LastName, user.LastName);
            Assert.Equal(expectedUser.Email, user.Email);
            Assert.Equal(expectedUser.ImageUrl, user.ImageUrl);
        }

        [Fact]
        public void Authenticate_ReturnsOkResult_WithValidCredentials()
        {
            // Arrange
            var loginDTO = new LoginDTO
            {
                Email = "test@example.com",
                Password = "password"
            };

            var token = "valid_token";

            var userServiceMock = new Mock<IUserService>();
            userServiceMock.Setup(service => service.Authenticate(loginDTO.Email, loginDTO.Password))
                           .Returns(token);

            var controller = new UserController(userServiceMock.Object);

            // Act
            var result = controller.Login(loginDTO);

            // Assert
            var okResult = Assert.IsType<ActionResult<string>>(result);
            Assert.IsType<OkObjectResult>(okResult.Result);
            var objectResult = (OkObjectResult)okResult.Result;
            Assert.Equal(token, objectResult.Value.GetType().GetProperty("token").GetValue(objectResult.Value, null));
        }



        [Fact]
        public void Authenticate_ReturnsUnauthorized_WithInvalidCredentials()
        {
            // Arrange
            var loginDTO = new LoginDTO
            {
                Email = "test@example.com",
                Password = "invalid_password"
            };

            var userServiceMock = new Mock<IUserService>();
            userServiceMock.Setup(service => service.Authenticate(loginDTO.Email, loginDTO.Password))
                           .Returns((string)null);

            var controller = new UserController(userServiceMock.Object);

            // Act
            var result = controller.Login(loginDTO);

            // Assert
            var unauthorizedResult = Assert.IsType<ActionResult<string>>(result);
            Assert.IsType<UnauthorizedResult>(unauthorizedResult.Result);
        }



    }
}
