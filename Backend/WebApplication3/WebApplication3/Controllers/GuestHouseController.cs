using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjP2M.Models;
using ProjP2M.Services;
using Stripe;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProjP2M.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GuestHouseController : ControllerBase
    {
        private readonly IGuestHouseService _guestHouseService;
        private readonly IConfiguration _configuration; // Inject IConfiguration
        private readonly ILogger<GuestHouseController> _logger; // Inject ILogger


        public GuestHouseController(IGuestHouseService guestHouseService, IConfiguration configuration, ILogger<GuestHouseController> logger)
        {
            _guestHouseService = guestHouseService;
            _configuration = configuration;
            _logger = logger; // Assign logger to _logger field

        }

        [HttpGet]
        public async Task<ActionResult<List<GuestHouse>>> Get()
        {
            var guestHouses = await _guestHouseService.GetAsync();
            return Ok(guestHouses);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GuestHouse>> GetById(string id)
        {
            var guestHouse = await _guestHouseService.GetAsync(id);

            if (guestHouse == null)
            {
                return NotFound();
            }

            return Ok(guestHouse);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] GuestHouseDTO newGuestHouseDTO)
        {
            var newGuestHouse = new GuestHouse
            {
                Name = newGuestHouseDTO.Name,
                Description = newGuestHouseDTO.Description,
                keywords = newGuestHouseDTO.keywords,
                AvailableDates = newGuestHouseDTO.AvailableDates,
                City = newGuestHouseDTO.City,
                Location = newGuestHouseDTO.Location,
                PricePerday = newGuestHouseDTO.PricePerday,
                RatingGlobal = newGuestHouseDTO.RatingGlobal,
                Nb_person = newGuestHouseDTO.Nb_person,
                Nb_room = newGuestHouseDTO.Nb_room,
                Nb_bed = newGuestHouseDTO.Nb_bed,
                Nb_bed_bayby = newGuestHouseDTO.Nb_bed_bayby,
                ImageUrls = newGuestHouseDTO.ImageUrls
            };

            await _guestHouseService.CreateAsync(newGuestHouse);
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] GuestHouseDTO updatedGuestHouseDTO)
        {
            var existingGuestHouse = await _guestHouseService.GetAsync(id);

            if (existingGuestHouse == null)
            {
                return NotFound();
            }

            existingGuestHouse.Name = updatedGuestHouseDTO.Name;
            existingGuestHouse.Description = updatedGuestHouseDTO.Description;
            existingGuestHouse.keywords = updatedGuestHouseDTO.keywords;
            existingGuestHouse.AvailableDates = updatedGuestHouseDTO.AvailableDates;
            existingGuestHouse.City = updatedGuestHouseDTO.City;
            existingGuestHouse.Location = updatedGuestHouseDTO.Location;
            existingGuestHouse.PricePerday = updatedGuestHouseDTO.PricePerday;
            existingGuestHouse.RatingGlobal = updatedGuestHouseDTO.RatingGlobal;
            existingGuestHouse.Nb_person = updatedGuestHouseDTO.Nb_person;
            existingGuestHouse.Nb_room = updatedGuestHouseDTO.Nb_room;
            existingGuestHouse.Nb_bed = updatedGuestHouseDTO.Nb_bed;
            existingGuestHouse.Nb_bed_bayby = updatedGuestHouseDTO.Nb_bed_bayby;
            existingGuestHouse.ImageUrls = updatedGuestHouseDTO.ImageUrls;

            await _guestHouseService.UpdateAsync(id, existingGuestHouse);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var existingGuestHouse = await _guestHouseService.GetAsync(id);

            if (existingGuestHouse == null)
            {
                return NotFound();
            }

            await _guestHouseService.RemoveAsync(id);

            return NoContent();
        }

        [HttpPost("{id}/processPayment")]
        public async Task<IActionResult> ProcessPayment(string id, [FromBody] PaymentDTO paymentDTO)
        {
            try
            {
                var guestHouse = await _guestHouseService.GetAsync(id);

                if (guestHouse == null)
                {
                    _logger.LogWarning("Guest house with ID {GuestHouseId} not found", id);
                    return NotFound();
                }
                _logger.LogInformation("GuestHouseId is:", id);



                // Verify payment details, retrieve Stripe API key from configuration
                var stripeApiKey = _configuration["Stripe:SecretKey"];

                // Initialize Stripe configuration
                StripeConfiguration.ApiKey = stripeApiKey;

                // Create a charge using Stripe SDK
                var options = new ChargeCreateOptions
                {
                    Amount = paymentDTO.Amount,
                    Currency = "usd",
                    Source = paymentDTO.TokenId,
                    Description = $"Payment for guest house {id}"
                };

                var service = new ChargeService();
                var charge = await service.CreateAsync(options);

                // Payment successful, handle accordingly
                _logger.LogInformation("Payment successful for guest house {GuestHouseId}", id);
                return Ok(new { success = true, message = "Payment successful" });
            }
            catch (Exception ex)
            {
                // Log the exception
                _logger.LogError(ex, "Error processing payment for guest house {GuestHouseId}", id);

                // Payment failed, handle accordingly
                return BadRequest(new { success = false, message = ex.Message });
            }
        }




    }
}
