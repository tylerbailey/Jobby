using Jobby.Server.Domain;
using Jobby.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Jobby.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/event")]
    public class EventController(IEventService eventService) : Controller
    {
        private readonly IEventService _eventService = eventService;

        [HttpPost("new")]
        public async Task<IActionResult> createEvent(JobEventModel jobEvent)
        {
            await _eventService.CreateEventAsync(jobEvent);
            return Ok();
        }
    }
}
