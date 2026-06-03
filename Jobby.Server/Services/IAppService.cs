using Jobby.Server.Domain;

namespace Jobby.Server.Services
{
    public interface IAppService
    {
        Task<List<UserJobApplicationModel>> GetAppsAsync(string userId);
        Task<UserJobApplicationModel> GetAppAsync(string userId, int applicationId);
        Task CreateNewAppAsync(UserJobApplicationModel application);
        Task DeleteAppAsync(int appId, string userId);
        Task UpdateAppAsync(UserJobApplicationModel application);
        Task<List<AppStageModel>> GetAllAppStages();
        Task<List<AppStageModel>> GetUserPipeline(string userId);
        Task<List<LocationTypesModel>> GetAppLocations();
    }
}
