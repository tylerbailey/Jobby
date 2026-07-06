using Jobby.Server.Domain;

namespace Jobby.Server.Services
{
    public interface IProfileService
    {
        Task<ProfileStatsModel> GetMonthlyStatsAsync(string userId);
        Task<string?> UpdateDisplayNameAsync(string userId, string displayName);
    }
}
