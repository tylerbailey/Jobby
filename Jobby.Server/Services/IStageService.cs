using Jobby.Server.Domain;

namespace Jobby.Server.Services
{
    public interface IStageService
    {
        Task CreateStage(AppStageModel appStage, string userId);
        Task DeleteStage(int stageId, string userId);
        Task UpdateStage(AppStageModel appStage, string userId);
        Task<List<AppStageModel>> GetUserPipeline(string userId);
    }
}