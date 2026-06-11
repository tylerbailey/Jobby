using Jobby.Server.Domain;

namespace Jobby.Server.Services
{
    public interface IHistoryService
    {
        Task CreateHistoryAsync(JobHistoryModel jobHistory);
        Task<List<JobHistoryModel>> GetHistoryAsync(int appId);
    }
}