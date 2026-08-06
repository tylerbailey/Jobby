using Jobby.Models.Dto;

namespace Jobby.Server.Services;

public interface IStageService
{
    /// <summary>Creates a new pipeline stage as the first stage and shifts existing stages down.</summary>
    Task CreateStageAsync(JobStageDto appStage, string userId);
    /// <summary>Deletes a pipeline stage if it has no associated jobs.</summary>
    Task DeleteStageAsync(int stageId, string userId);
    /// <summary>Updates the display order of the user's pipeline stages.</summary>
    Task ReorderStagesAsync(ReorderStagesRequest request, string userId);
    /// <summary>Updates the name and color of an existing pipeline stage.</summary>
    Task UpdateStageAsync(JobStageDto appStage, string userId);
    /// <summary>Retrieves the user's full pipeline of stages with their associated jobs and upcoming events.</summary>
    Task<List<JobStageDto>> GetUserPipelineAsync(string userId);
}
