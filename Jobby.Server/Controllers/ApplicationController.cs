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
    public class ApplicationController(IAppService appService, IEventService eventService) : Controller
    {
        private readonly IAppService _appService = appService;
        private readonly IEventService _eventService = eventService;

        [HttpGet("{applicationId}")]
        public async Task<IActionResult> GetApplicationAsync(int applicationId)
        {
            var application = await _appService.GetAppAsync(User.Identity!.Name ?? string.Empty, applicationId);
            return Ok(application);
        }

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
            await _appService.UpdateAppAsync(application);
            return Ok();
        }

        [HttpGet("locations")]
        public async Task<IActionResult> GetAllApplicationLocations()
        {
            var locations = await _appService.GetAppLocationsAsync();
            return Ok(locations);
        }

        [HttpGet("events/{applicationId}")]
        public async Task<IActionResult> GetApplicationEvents(int applicationId)
        {
            var events = await _eventService.GetEventsAsync(applicationId);
            return Ok(events);
        }

        [HttpGet("events/upcoming/{applicationId}")]
        public async Task<IActionResult> GetUpcomingApplicationEvents(int applicationId)
        {
            var events = await _eventService.GetUpcomingEventsAsync(applicationId);
            return Ok(events);
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

        [HttpPost("gen/{applicationId}")]
        public async Task<IActionResult> GenerateResumeAsync([FromForm] IFormFile file, int applicationId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var app = await _appService.GetAppAsync(userId, applicationId);
            var memoryStream = await _appService.EditDocxAsync(file, app.JobPostingUrl);
            return File(
                memoryStream.ToArray(),
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "TailoredResume.docx");
        }
       }
}
