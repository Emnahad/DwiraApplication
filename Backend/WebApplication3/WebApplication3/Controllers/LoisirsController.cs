using Microsoft.AspNetCore.Mvc;
using ProjP2M.Models;
using ProjP2M.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProjP2M.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoisirsController : ControllerBase
    {
        private readonly LoisirsService _loisirsService;

        public LoisirsController(LoisirsService loisirsService)
        {
            _loisirsService = loisirsService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Loisirs>>> Get()
        {
            var loisirs = await _loisirsService.GetAsync();
            return Ok(loisirs);
        }
        [HttpGet("{Idl}")]
        public async Task<ActionResult<Loisirs>> Get(string Idl)
        {
            var loisirs = await _loisirsService.GetAsync(Idl);

            if (loisirs == null)
            {
                return NotFound();
            }

            return Ok(loisirs);
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Loisirs newLoisirs)
        {
            await _loisirsService.CreateAsync(newLoisirs);
            return NoContent();
        }

        [HttpPut("{Idl}")]
        public async Task<IActionResult> Update(string Idl, [FromBody] Loisirs updatedLoisirs)
        {
            var existingLoisirs = await _loisirsService.GetAsync(Idl);

            if (existingLoisirs == null)
            {
                return NotFound();
            }
            updatedLoisirs.Idl = existingLoisirs.Idl;

            await _loisirsService.UpdateAsync(Idl, updatedLoisirs);
            return NoContent();
        }

        [HttpDelete("{Idl}")]
        public async Task<IActionResult> Delete(string Idl)
        {
            var existingLoisirs = await _loisirsService.GetAsync(Idl);

            if (existingLoisirs == null)
            {
                return NotFound();
            }

            await _loisirsService.RemoveAsync(Idl);

            return NoContent();
        }

    }
}
