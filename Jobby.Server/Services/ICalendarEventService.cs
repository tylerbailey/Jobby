using Jobby.Models.Dto;

namespace Jobby.Server.Services;

public interface ICalendarEventService
{
    /// <summary>Creates a new calendar event and, if linked to a job, records its creation in the job history.</summary>
    Task CreateEventAsync(JobEventModel jobEvent, string userId);
    /// <summary>Soft-deletes a calendar event and records the deletion in the job history.</summary>
    Task DeleteEventAsync(int eventId, string userId);
    /// <summary>Retrieves all active calendar events for the given job application.</summary>
    Task<List<JobEventModel>> GetEventsAsync(int appId);
    /// <summary>Retrieves active calendar events for the given job application that occur in the future.</summary>
    Task<List<JobEventModel>> GetUpcomingEventsAsync(int appId);
    /// <summary>Retrieves all active calendar events across all of the user's job applications, including the related job details.</summary>
    Task<List<JobEventModel>> GetUserEventsAsync(string userId);
}
