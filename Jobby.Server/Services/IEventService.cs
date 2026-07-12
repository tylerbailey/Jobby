using Jobby.Models.Dto;

namespace Jobby.Server.Services;

public interface IEventService
{
    Task CreateEventAsync(JobEventModel jobEvent);
    Task DeleteEventAsync(int eventId, string userId);
    Task<List<JobEventModel>> GetEventsAsync(int appId);
    Task<List<JobEventModel>> GetUpcomingEventsAsync(int appId);
    Task<List<JobEventModel>> GetUserEventsAsync(string userId);
}
