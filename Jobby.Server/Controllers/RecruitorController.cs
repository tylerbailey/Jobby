using Jobby.Server.Domain;
using Jobby.Server.Entities;
using Jobby.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Jobby.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/recruiter")]
    public class RecruitorController(IRecruiterService recruiterService) : Controller
    {
        private readonly IRecruiterService _recruiterService = recruiterService;

        [HttpPost("new")]
        public async Task<IActionResult> CreateRecruiter(RecruiterModel recruiter)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            await _recruiterService.CreateRecruitor(recruiter, userId);
            return Ok();
        }

        [HttpGet("{recruiterId}")]
        public async Task<IActionResult> GetRecruiter(int recruiterId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var recruiter = await _recruiterService.GetRecruitor(recruiterId, userId);
            return Ok(recruiter);
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetRecruiters()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var recruiters = await _recruiterService.GetRecruitors(userId);
            return Ok(recruiters);
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateRecruiter(RecruiterModel recruiter)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            await _recruiterService.UpdateRecruitor(recruiter);
            return Ok();
        }

        [HttpDelete("{recruiterId}")]
        public async Task<IActionResult> DeleteRecruiter(int recruiterId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            await _recruiterService.DeleteRecruitor(recruiterId, userId);
            return Ok();
        }
    }
}
