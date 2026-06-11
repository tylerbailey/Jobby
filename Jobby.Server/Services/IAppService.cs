using Jobby.Server.Domain;

namespace Jobby.Server.Services
{
    public interface IAppService
    {
        Task CreateNewAppAsync(UserJobApplicationModel application, string userId);
        Task DeleteAppAsync(int appId, string userId);
        Task<MemoryStream> EditDocxAsync(IFormFile file, string jobPostingUrl);
        Task<UserJobApplicationModel> GetAppAsync(string userId, int applicationId);
        Task<List<LocationTypeModel>> GetAppLocationsAsync();
        Task MoveApplicationStageAsync(int applicationId, int stageId, string userId);
        Task UpdateAppAsync(UserJobApplicationModel application);
    }
}
