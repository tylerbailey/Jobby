using Jobby.Infrastructure.Data;
using Jobby.Models.Dto;
using Jobby.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Jobby.Server.Services
{
    public class ProfileService(
        IDbContextFactory<AppDbContext> dbContextFactory,
        UserManager<ApplicationUser> userManager) : IProfileService
    {
        private const int WindowDays = 30;

        private readonly IDbContextFactory<AppDbContext> _dbContextFactory = dbContextFactory;
        private readonly UserManager<ApplicationUser> _userManager = userManager;

        /// <summary>Computes daily counts of jobs added and applied to over the trailing 30-day window for the given user.</summary>
        public async Task<ProfileStatsModel> GetMonthlyStatsAsync(string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();

            var periodEnd = DateOnly.FromDateTime(DateTime.UtcNow);
            var periodStart = periodEnd.AddDays(-(WindowDays - 1));

            var apps = await db.Jobs
                .AsNoTracking()
                .Where(a => a.UserId == userId && !a.Disabled)
                .Select(a => new { a.Created, a.Applied })
                .ToListAsync();

            var dailyStats = new List<DailyStatModel>(WindowDays);
            var totalAdded = 0;
            var totalApplied = 0;

            for (var offset = 0; offset < WindowDays; offset++)
            {
                var day = periodStart.AddDays(offset);

                var added = apps.Count(a => DateOnly.FromDateTime(a.Created) == day);
                var applied = apps.Count(a =>
                    a.Applied is not null &&
                    DateOnly.FromDateTime(a.Applied.Value) == day);

                totalAdded += added;
                totalApplied += applied;

                dailyStats.Add(new DailyStatModel
                {
                    Date = day.ToString("yyyy-MM-dd"),
                    Added = added,
                    Applied = applied,
                });
            }

            return new ProfileStatsModel
            {
                TotalAdded = totalAdded,
                TotalApplied = totalApplied,
                DailyStats = dailyStats,
            };
        }

        /// <summary>Updates the display name of the given user, returning an error message on failure.</summary>
        public async Task<string?> UpdateDisplayNameAsync(string userId, string displayName)
        {
            if (string.IsNullOrWhiteSpace(displayName))
                return "Display name is required.";

            var user = await _userManager.FindByIdAsync(userId);
            if (user is null)
                return "User not found.";

            user.DisplayName = displayName.Trim();
            var result = await _userManager.UpdateAsync(user);

            return result.Succeeded ? null : result.Errors.FirstOrDefault()?.Description;
        }
    }
}
