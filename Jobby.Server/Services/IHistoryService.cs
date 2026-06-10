using Jobby.Server.Domain;

namespace Jobby.Server.Services
{
    public interface IHistoryService
    {
        Task CreateHistory(JobHistoryModel jobHistory);
        Task<List<JobHistoryModel>> GetAllHistory(int appId);
    }
}