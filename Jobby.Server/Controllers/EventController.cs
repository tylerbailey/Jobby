using Jobby.Server.Domain;
using Jobby.Server.Entities;
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
        public async Task<IActionResult> CreateEvent(JobEventModel jobEvent)
        {
            await _eventService.CreateEventAsync(jobEvent);
            return Ok();
        }

        [HttpGet("get")]
        public async Task<IActionResult> GetEvents()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var events = await _eventService.GetUserEvents(userId);
            return Ok(events);
        }

        [HttpDelete("delete/{eventId}")]
        public async Task<IActionResult> DeleteEvent(int eventId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            await _eventService.DeleteEvent(eventId, userId);
            return Ok();
        }
    }
}