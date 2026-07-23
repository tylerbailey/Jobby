using Jobby.Models.Dto;

namespace Jobby.Server.Services;

public interface IStageService
{
    Task CreateStageAsync(JobStageModel appStage, string userId);
    Task DeleteStageAsync(int stageId, string userId);
    Task ReorderStagesAsync(ReorderStagesRequest request, string userId);
    Task UpdateStageAsync(JobStageModel appStage, string userId);
    Task<List<JobStageModel>> GetUserPipelineAsync(string userId);
}
