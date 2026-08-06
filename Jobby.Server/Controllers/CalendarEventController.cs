using Jobby.Models.Dto;
using Jobby.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Jobby.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/events")]
    public class CalendarEventController(ICalendarEventService eventService) : Controller
    {
        private readonly ICalendarEventService _eventService = eventService;

        /// <summary>Creates a new calendar event for the current user.</summary>
        [HttpPost("new")]
        public async Task<IActionResult> CreateEvent(JobEventDto jobEvent)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            await _eventService.CreateEventAsync(jobEvent, userId);
            return Ok();
        }

        /// <summary>Gets all calendar events for the current user.</summary>
        [HttpGet("get")]
        public async Task<IActionResult> GetEvents()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var events = await _eventService.GetUserEventsAsync(userId);
            return Ok(events);
        }

        /// <summary>Deletes a calendar event belonging to the current user.</summary>
        [HttpDelete("delete/{eventId}")]
        public async Task<IActionResult> DeleteEvent(int eventId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            await _eventService.DeleteEventAsync(eventId, userId);
            return Ok();
        }

        /// <summary>Gets all calendar events for a specific job application.</summary>
        [HttpGet("{applicationId}")]
        public async Task<IActionResult> GetApplicationEvents(int applicationId)
        {
            var events = await _eventService.GetEventsAsync(applicationId);
            return Ok(events);
        }

        /// <summary>Gets upcoming calendar events for a specific job application.</summary>
        [HttpGet("upcoming/{applicationId}")]
        public async Task<IActionResult> GetUpcomingApplicationEvents(int applicationId)
        {
            var events = await _eventService.GetUpcomingEventsAsync(applicationId);
            return Ok(events);
        }
    }
}