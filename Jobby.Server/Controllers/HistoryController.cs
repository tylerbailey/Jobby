using Jobby.Server.Domain;
using Jobby.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Jobby.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/history")]
    public class HistoryController(IHistoryService historyService) : Controller
    {
        public readonly IHistoryService _historyService = historyService;        

        [HttpGet("{appId}")]
        public async Task<IActionResult> GetHistory(int appId)
        {
            List<JobHistoryModel> jobHistories = await _historyService.GetHistoryAsync(appId);
            return Ok(jobHistories);
        }

    }
}
