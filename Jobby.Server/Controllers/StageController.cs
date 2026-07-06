using Jobby.Server.Domain;
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

        [HttpPost("new")]
        public async Task<IActionResult> CreateStage(AppStageModel appStage)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            await _stageService.CreateStageAsync(appStage, userId);
            return Ok();
        }
        [HttpPost("update")]
        public async Task<IActionResult> UpdateStage(AppStageModel appStage)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            await _stageService.UpdateStageAsync(appStage, userId);
            return Ok();
        }

        [HttpPost("reorder")]
        public async Task<IActionResult> ReorderStages(ReorderStagesRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            await _stageService.ReorderStagesAsync(request, userId);
            return Ok();
        }

        [HttpDelete("delete/{stageId}")]
        public async Task<IActionResult> DeleteStage(int stageId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            await _stageService.DeleteStageAsync(stageId, userId);
            return Ok();
        }

        [HttpGet("pipeline")]
        public async Task<IActionResult> GetUserPipeline()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var stages = await _stageService.GetUserPipelineAsync(userId);
            return Ok(stages);
        }
    }
}
