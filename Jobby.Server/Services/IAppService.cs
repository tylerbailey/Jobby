using Jobby.Models.Dto;

namespace Jobby.Server.Services;

public interface IAppService
{
    Task ArchiveAppAsync(int appId, bool isArchived, string userId);
    Task CreateNewAppAsync(UserJobApplicationModel application, string userId);
    Task DeleteAppAsync(int appId, string userId);
    Task<ResumeGenerationResponse> EditDocxAsync(IFormFile file, string posting);
    Task<JobPostingData> ScrapeJobPostingAsync(string url, CancellationToken cancellationToken = default);
    Task<UserJobApplicationModel> GetAppAsync(string userId, int applicationId);
    Task<List<UserJobApplicationModel>> GetAppsAsync(string userId);
    Task<List<UserJobApplicationModel>> GetArchivedAppsAsync(string userId);
    Task<List<LocationTypeModel>> GetAppLocationsAsync();
    Task MoveApplicationStageAsync(int applicationId, int stageId, string userId);
    Task UpdateAppAsync(UserJobApplicationModel application, string userId);
}
