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

        [HttpGet("stages")]
        public async Task<IActionResult> GetApplicationStages() {
            var stages = await _appService.GetAllAppStages() ?? [];
            return Ok(stages);
        }

        [HttpGet("pipeline")]
        public async Task<IActionResult> GetUserPipeline()
        {
            var stages = await _appService.GetUserPipeline(User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty);           
            return Ok(stages);
        }

        [HttpGet("locations")]
        public async Task<IActionResult> GetAllApplicationLocations()
        {
            var locations = await _appService.GetAppLocations();
            return Ok(locations);
        }
    }
}
