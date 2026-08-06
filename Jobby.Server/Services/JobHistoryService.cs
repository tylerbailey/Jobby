using Jobby.Infrastructure.Data;
using Jobby.Models.Dto;
using Jobby.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Jobby.Server.Services;

public class JobHistoryService(IDbContextFactory<AppDbContext> dbContextFactory) : ServiceBase(dbContextFactory), IJobHistoryService
{
    /// <summary>Creates a new job history entry.</summary>
    public async Task CreateHistoryAsync(JobHistoryDto jobHistory)
    {
        await using var db = await _dbContextFactory.CreateDbContextAsync();
        await db.JobHistories.AddAsync(new JobHistory
        {
            JobId = jobHistory.AppId,
            Color = jobHistory.Color,
            Created = DateTime.UtcNow,
            EventTitle = jobHistory.EventTitle,
            EventDescription = jobHistory.EventDescription,
        });
        await db.SaveChangesAsync();
    }

    /// <summary>Retrieves the active history entries for a job application owned by the given user.</summary>
    public async Task<List<JobHistoryDto>> GetHistoryAsync(int appId, string userId)
    {
        await using var db = await _dbContextFactory.CreateDbContextAsync();
        var ownsApp = await db.Jobs.AnyAsync(a => a.Id == appId && a.UserId == userId && !a.Disabled);

        if (!ownsApp)
            return [];

        return await db.JobHistories
            .Where(h => h.JobId == appId && !h.Disabled)
            .Select(history => new JobHistoryDto
            {
                AppId = history.JobId,
                Color = history.Color,
                EventDate = history.Created,
                EventTitle = history.EventTitle,
                EventDescription = history.EventDescription,
            })
            .ToListAsync();
    }
}
