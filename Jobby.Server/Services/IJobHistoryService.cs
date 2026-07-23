using Jobby.Models.Dto;

namespace Jobby.Server.Services;

public interface IJobHistoryService
{
    Task CreateHistoryAsync(JobHistoryModel jobHistory);
    Task<List<JobHistoryModel>> GetHistoryAsync(int appId, string userId);
}
