using Jobby.Models.Dto;

namespace Jobby.Server.Services
{
    public interface IProfileService
    {
        /// <summary>Computes daily counts of jobs added and applied to over the trailing 30-day window for the given user.</summary>
        Task<ProfileStatsDto> GetMonthlyStatsAsync(string userId);
        /// <summary>Updates the display name of the given user, returning an error message on failure.</summary>
        Task<string?> UpdateDisplayNameAsync(string userId, string displayName);
    }
}
