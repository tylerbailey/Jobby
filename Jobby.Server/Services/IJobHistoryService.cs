using Jobby.Models.Dto;

namespace Jobby.Server.Services;

public interface IJobHistoryService
{
    /// <summary>Creates a new job history entry.</summary>
    Task CreateHistoryAsync(JobHistoryModel jobHistory);
    /// <summary>Retrieves the active history entries for a job application owned by the given user.</summary>
    Task<List<JobHistoryModel>> GetHistoryAsync(int appId, string userId);
}
