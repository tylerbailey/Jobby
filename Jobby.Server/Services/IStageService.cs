using Jobby.Models.Dto;

namespace Jobby.Server.Services;

public interface IStageService
{
    Task CreateStageAsync(AppStageModel appStage, string userId);
    Task DeleteStageAsync(int stageId, string userId);
    Task ReorderStagesAsync(ReorderStagesRequest request, string userId);
    Task UpdateStageAsync(AppStageModel appStage, string userId);
    Task<List<AppStageModel>> GetUserPipelineAsync(string userId);
}
