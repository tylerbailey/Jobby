using Jobby.Models.Dto;
using Jobby.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Jobby.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/stage")]
    public class StageController(IStageService stageService) : Controller
    {
        private readonly IStageService _stageService = stageService;

        /// <summary>Creates a new pipeline stage for the current user.</summary>
        [HttpPost("new")]
        public async Task<IActionResult> CreateStage(JobStageDto appStage)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            await _stageService.CreateStageAsync(appStage, userId);
            return Ok();
        }
        /// <summary>Updates an existing pipeline stage for the current user.</summary>
        [HttpPost("update")]
        public async Task<IActionResult> UpdateStage(JobStageDto appStage)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            await _stageService.UpdateStageAsync(appStage, userId);
            return Ok();
        }

        /// <summary>Reorders the current user's pipeline stages.</summary>
        [HttpPost("reorder")]
        public async Task<IActionResult> ReorderStages(ReorderStagesRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            await _stageService.ReorderStagesAsync(request, userId);
            return Ok();
        }

        /// <summary>Deletes a pipeline stage belonging to the current user.</summary>
        [HttpDelete("delete/{stageId}")]
        public async Task<IActionResult> DeleteStage(int stageId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            await _stageService.DeleteStageAsync(stageId, userId);
            return Ok();
        }

        /// <summary>Gets the current user's pipeline stages.</summary>
        [HttpGet("pipeline")]
        public async Task<IActionResult> GetUserPipeline()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var stages = await _stageService.GetUserPipelineAsync(userId);
            return Ok(stages);
        }
    }
}
