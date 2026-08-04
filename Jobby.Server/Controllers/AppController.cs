using Jobby.Models.Dto;
using Jobby.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Jobby.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/app")]
    public class AppController(IJobService appService) : Controller
    {
        private readonly IJobService _appService = appService;

        /// <summary>Gets all job applications for the current user.</summary>
        [HttpGet("all")]
        public async Task<IActionResult> GetAllApplicationsAsync()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var applications = await _appService.GetAppsAsync(userId);
            return Ok(applications);
        }

        /// <summary>Creates a new job application for the current user.</summary>
        [HttpPost("new")]
        public async Task<IActionResult> CreateApplication(JobModel application)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            await _appService.CreateNewAppAsync(application, userId);
            return Ok();
        }

        /// <summary>Updates an existing job application for the current user.</summary>
        [HttpPost("update")]
        public async Task<ActionResult> UpdateApplication(JobModel application)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            await _appService.UpdateAppAsync(application, userId);
            return Ok();
        }

        /// <summary>Gets the distinct set of locations used across all applications.</summary>
        [HttpGet("locations")]
        public async Task<IActionResult> GetAllApplicationLocations()
        {
            var locations = await _appService.GetAppLocationsAsync();
            return Ok(locations);
        }

        /// <summary>Moves a job application to a different pipeline stage.</summary>
        [HttpPost("move/{applicationId}")]
        public async Task<IActionResult> MoveStage(int applicationId, [FromQuery] int stageId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            await _appService.MoveApplicationStageAsync(applicationId, stageId, userId);
            return Ok();
        }

        /// <summary>Deletes a job application belonging to the current user.</summary>
        [HttpDelete("{applicationId}")]
        public async Task<IActionResult> DeleteApplication(int applicationId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            await _appService.DeleteAppAsync(applicationId, userId);
            return Ok();
        }

        /// <summary>Scrapes and extracts structured job posting data from a given URL.</summary>
        [HttpPost("scrape-posting")]
        public async Task<IActionResult> ScrapeJobPostingAsync(
            ScrapeJobPostingRequest request,
            CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Url))
                return BadRequest(new { message = "Job posting URL is required." });

            try
            {
                var postingData = await _appService.ScrapeJobPostingAsync(request.Url, cancellationToken);
                return Ok(postingData);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>Generates a tailored resume docx from an uploaded resume and job posting text.</summary>
        [HttpPost("gen")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> GenerateResumeAsync(IFormFile file, [FromForm] string posting)
        {
            if (file is null || file.Length == 0)
                return BadRequest(new { message = "A docx file is required." });

            if (string.IsNullOrWhiteSpace(posting))
                return BadRequest(new { message = "Job posting text is required." });

            var result = await _appService.EditDocxAsync(file, posting);
            return Ok(result);
        }

        /// <summary>Gets all archived job applications for the current user.</summary>
        [HttpGet("archive")]
        public async Task<IActionResult> GetArchivedApplications()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var archives = await _appService.GetArchivedAppsAsync(userId);
            return Ok(archives);
        }
    }
}
