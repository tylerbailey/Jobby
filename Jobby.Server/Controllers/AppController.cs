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
    public class AppController(IAppService appService) : Controller
    {
        private readonly IAppService _appService = appService;

        [HttpGet("all")]
        public async Task<IActionResult> GetAllApplicationsAsync()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var applications = await _appService.GetAppsAsync(userId);
            return Ok(applications);
        }

        [HttpPost("new")]
        public async Task<IActionResult> CreateApplication(UserJobApplicationModel application)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            await _appService.CreateNewAppAsync(application, userId);
            return Ok();
        }

        [HttpPost("update")]
        public async Task<ActionResult> UpdateApplication(UserJobApplicationModel application)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            await _appService.UpdateAppAsync(application, userId);
            return Ok();
        }

        [HttpGet("locations")]
        public async Task<IActionResult> GetAllApplicationLocations()
        {
            var locations = await _appService.GetAppLocationsAsync();
            return Ok(locations);
        }

        [HttpPost("move/{applicationId}")]
        public async Task<IActionResult> MoveStage(int applicationId, [FromQuery] int stageId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            await _appService.MoveApplicationStageAsync(applicationId, stageId, userId);
            return Ok();
        }

        [HttpDelete("{applicationId}")]
        public async Task<IActionResult> DeleteApplication(int applicationId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            await _appService.DeleteAppAsync(applicationId, userId);
            return Ok();
        }

        [HttpPost("gen")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> GenerateResumeAsync([FromForm] IFormFile file, [FromForm] string posting)
        {
            if (file is null || file.Length == 0)
                return BadRequest(new { message = "A docx file is required." });

            if (string.IsNullOrWhiteSpace(posting))
                return BadRequest(new { message = "Job posting text is required." });

            var result = await _appService.EditDocxAsync(file, posting);
            return Ok(result);
        }

        [HttpGet("archive")]
        public async Task<IActionResult> GetArchivedApplications()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var archives = await _appService.GetArchivedAppsAsync(userId);
            return Ok(archives);
        }
    }
}
