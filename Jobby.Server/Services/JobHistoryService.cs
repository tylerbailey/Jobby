using Jobby.Infrastructure.Data;
using Jobby.Models.Dto;
using Jobby.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Jobby.Server.Services;

public class JobHistoryService(IDbContextFactory<AppDbContext> dbContextFactory) : ServiceBase(dbContextFactory), IJobHistoryService
{
    public async Task CreateHistoryAsync(JobHistoryModel jobHistory)
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

    public async Task<List<JobHistoryModel>> GetHistoryAsync(int appId, string userId)
    {
        await using var db = await _dbContextFactory.CreateDbContextAsync();
        var ownsApp = await db.Jobs.AnyAsync(a => a.Id == appId && a.UserId == userId && !a.Disabled);

        if (!ownsApp)
            return [];

        return await db.JobHistories
            .Where(h => h.JobId == appId && !h.Disabled)
            .Select(history => new JobHistoryModel
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
