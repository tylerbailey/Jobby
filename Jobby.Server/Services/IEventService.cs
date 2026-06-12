using Jobby.Server.Domain;

namespace Jobby.Server.Services
{
    public interface IEventService
    {
        Task CreateEventAsync(JobEventModel jobEvent);
        Task<List<JobEventModel>> GetEventsAsync(int appId);
        Task<List<JobEventModel>> GetUpcomingEventsAsync(int appId);
    }
}