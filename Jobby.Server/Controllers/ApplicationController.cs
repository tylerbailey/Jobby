using Jobby.Server.Domain;
using Jobby.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Jobby.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/app")]
    public class ApplicationController(IAppService appService) : Controller
    {
        private readonly IAppService _appService = appService;

        [HttpGet("{applicationId}")]
        public async Task<IActionResult> GetApplicationAsync(int applicationId)
        {
            var application = await _appService.GetAppAsync(User.Identity!.Name ?? string.Empty, applicationId);
            return Ok(application);
        }

        [HttpPost("new")]
        public async Task<IActionResult> CreateApplication(UserJobApplicationModel application)
        {
            await _appService.CreateNewAppAsync(application);
            return Ok();
        }

        [HttpPost("update")]
        public async Task<ActionResult> UpdateApplication(UserJobApplicationModel application)
        {
            await _appService.UpdateAppAsync(application);
            return Ok();
        }

        [HttpGet("locations")]
        public async Task<IActionResult> GetAllApplicationLocations()
        {
            var locations = await _appService.GetAppLocations();
            return Ok(locations);
        }

        [HttpDelete("{applicationId}")]
        public async Task<IActionResult> DeleteApplication(int applicationId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            await _appService.DeleteAppAsync(applicationId, userId);
            return Ok();
        }

        [HttpPost("gen/{applicationId}")]
        public async Task<IActionResult> GenerateResumeAsync([FromForm] IFormFile file, int applicationId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var app = await _appService.GetAppAsync(userId, applicationId);
            var memoryStream = await _appService.EditDocx(file, app.JobPostingUrl);
            return File(
                memoryStream.ToArray(),
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "TailoredResume.docx");
        }
       }
}
