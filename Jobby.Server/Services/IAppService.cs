using Jobby.Server.Domain;

namespace Jobby.Server.Services
{
    public interface IAppService
    {
        Task<List<UserJobApplicationModel>> GetAppsAsync(string userId);
        Task<UserJobApplicationModel> GetAppAsync(string userId, int applicationId);
        Task<UserJobApplicationModel> CreateNewAppAsync(UserJobApplicationModel application);
        Task DeleteAppAsync(int appId, string userId);
        Task UpdateAppAsync(UserJobApplicationModel application);
        Task MoveApplicationStage(int applicationId, int stageId, string userId);
        Task<List<LocationTypesModel>> GetAppLocations();
        Task<MemoryStream> EditDocx(IFormFile file, string jobPostingUrl);
    }
}
