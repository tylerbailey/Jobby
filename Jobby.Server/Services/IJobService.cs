using Jobby.Models.Dto;

namespace Jobby.Server.Services;

public interface IJobService
{
    Task ArchiveAppAsync(int appId, bool isArchived, string userId);
    Task CreateNewAppAsync(JobModel application, string userId);
    Task DeleteAppAsync(int appId, string userId);
    Task<ResumeGenerationResponse> EditDocxAsync(IFormFile file, string posting);
    Task<JobPostingData> ScrapeJobPostingAsync(string url, CancellationToken cancellationToken = default);
    Task<JobModel> GetAppAsync(string userId, int applicationId);
    Task<List<JobModel>> GetAppsAsync(string userId);
    Task<List<JobModel>> GetArchivedAppsAsync(string userId);
    Task<List<LocationTypeModel>> GetAppLocationsAsync();
    Task MoveApplicationStageAsync(int applicationId, int stageId, string userId);
    Task UpdateAppAsync(JobModel application, string userId);
}
