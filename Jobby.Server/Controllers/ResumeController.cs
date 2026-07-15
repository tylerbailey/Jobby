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
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> RateResume(IFormFile file)
        {
            if (file is null || file.Length == 0)
                return BadRequest(new { message = "A docx file is required." });

            var response = await _resumeService.RateResumeAsync(file);
            return Ok(response);
        }
    }
}
