using Microsoft.AspNetCore.Mvc;
using Moq;
using ProjP2M.Controllers;
using ProjP2M.Models;
using ProjP2M.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjP2M.Tests.Controllers
{
    public class GuestHouseControllerTests
    {
        [Fact]
        public async Task Get_ReturnsOkResult()
        {
            // Arrange
            var mockService = new Mock<IGuestHouseService>();
            mockService.Setup(service => service.GetAsync()).ReturnsAsync(new List<GuestHouse>());

            var controller = new GuestHouseController(mockService.Object);

            // Act
            var result = await controller.Get();

            // Assert
            Assert.IsType<OkObjectResult>(result.Result);
        }
        [Fact]  
        public async Task GetById_ReturnsOkResult()
        {
            // Arrange
            var mockService = new Mock<IGuestHouseService>();
            var mockGuestHouse = new GuestHouse { Id = "1", Name = "Test Guest House" };
            mockService.Setup(service => service.GetAsync("1")).ReturnsAsync(mockGuestHouse);
            var controller = new GuestHouseController(mockService.Object);

            // Act
            var result = await controller.GetById("1");

            // Assert
            Assert.IsType<OkObjectResult>(result.Result);
        }
        [Fact]
        public async Task Update_ReturnsNoContentResult()
        {
            // Arrange
            var mockService = new Mock<IGuestHouseService>();
            var mockExistingHouse = new GuestHouse { Id = "3", Name = "Existing Guest House" };
            mockService.Setup(service => service.GetAsync("3")).ReturnsAsync(mockExistingHouse);

            var updatedGuestHouseDTO = new GuestHouseDTO
            {
                Name = "Updated Guest House",
                Description = "Updated Description",
                keywords = new List<string> { "keyword1", "keyword2" },
                AvailableDates = new List<DateOnly> { DateOnly.FromDateTime(DateTime.Today.AddDays(1)), DateOnly.FromDateTime(DateTime.Today.AddDays(2)) },
                City = "Updated City",
                Location = "Updated Location",
                PricePerday = 150.00,
                RatingGlobal = 4,
                Nb_person = 4,
                Nb_room = 2,
                Nb_bed = 3,
                Nb_bed_bayby = 1,
                ImageUrls = new List<string> { "url1", "url2", "url3" }
            };
            var controller = new GuestHouseController(mockService.Object);

            // Act
            var result = await controller.Update("3", updatedGuestHouseDTO);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }
        [Fact]
        public async Task Delete_ReturnsNoContentResult()
        {
            // Arrange
            var mockService = new Mock<IGuestHouseService>();
            var existingGuestHouse = new GuestHouse { Id = "3", Name = "Existing Guest House" };
            mockService.Setup(service => service.GetAsync("3")).ReturnsAsync(existingGuestHouse);
            var controller = new GuestHouseController(mockService.Object);

            // Act
            var result = await controller.Delete("3");

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

    }
}
