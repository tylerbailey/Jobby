using Jobby.Models.Dto;
using Jobby.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Jobby.Server.Controllers;

[Authorize]
[ApiController]
[Route("api/history")]
public class HistoryController(IJobHistoryService historyService) : Controller
{
    private readonly IJobHistoryService _historyService = historyService;

    /// <summary>Gets the change history for a specific job application.</summary>
    [HttpGet("{appId}")]
    public async Task<IActionResult> GetHistory(int appId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        var jobHistories = await _historyService.GetHistoryAsync(appId, userId);
        return Ok(jobHistories);
    }
}
