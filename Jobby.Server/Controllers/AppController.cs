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
        public async Task<IActionResult> CreateApplication(JobDto application)
        {
            var validationError = ValidateNewApplication(application);
            if (validationError is not null)
                return BadRequest(new { message = validationError });

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            await _appService.CreateNewAppAsync(application, userId);
            return Ok();
        }

        /// <summary>Updates an existing job application for the current user.</summary>
        [HttpPost("update")]
        public async Task<ActionResult> UpdateApplication(JobDto application)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var error = await _appService.UpdateAppAsync(application, userId);
            if (error is not null)
                return BadRequest(new { message = error });

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

        /// <summary>Rejects a new application that is missing a required value or exceeds a column limit.</summary>
        private static string? ValidateNewApplication(JobDto application)
        {
            if (string.IsNullOrWhiteSpace(application.CompanyName))
                return "Company name is required.";

            if (application.CompanyName.Length > 256)
                return "Company name must be 256 characters or fewer.";

            if (string.IsNullOrWhiteSpace(application.JobTitle))
                return "Job title is required.";

            if (application.JobTitle.Length > 256)
                return "Job title must be 256 characters or fewer.";

            if (application.LocationTypeId <= 0)
                return "Location type is required.";

            if ((application.Summary?.Length ?? 0) > 2046)
                return "Summary must be 2046 characters or fewer.";

            if ((application.JobPostingUrl?.Length ?? 0) > 1024)
                return "URL must be 1024 characters or fewer.";

            if ((application.Address?.Length ?? 0) > 512)
                return "Address must be 512 characters or fewer.";

            if ((application.ContactName?.Length ?? 0) > 256)
                return "Contact must be 256 characters or fewer.";

            if ((application.Notes?.Length ?? 0) > 2046)
                return "Notes must be 2046 characters or fewer.";

            if (application.Salary is < 0)
                return "Salary must be a whole number up to 2,147,483,647.";

            return null;
        }
    }
}
