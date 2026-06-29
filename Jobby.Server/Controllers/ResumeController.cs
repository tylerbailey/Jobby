using Jobby.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Jobby.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/resume")]
    public class ResumeController(IResumeService resumeService) : Controller
    {
        private readonly IResumeService _resumeService = resumeService;


        [HttpPost("review")]
        public async Task<IActionResult> RateResume([FromForm] IFormFile file)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var response = await _resumeService.RateResumeAsync(file);
            return Ok(response);
        }
    }
}
