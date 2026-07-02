using Jobby.Server.Domain;
using Jobby.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Jobby.Server.Controllers;

[Authorize]
[ApiController]
[Route("api/history")]
public class HistoryController(IHistoryService historyService) : Controller
{
    private readonly IHistoryService _historyService = historyService;

    [HttpGet("{appId}")]
    public async Task<IActionResult> GetHistory(int appId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        var jobHistories = await _historyService.GetHistoryAsync(appId, userId);
        return Ok(jobHistories);
    }
}
