using Jobby.Server.Data;
using Jobby.Server.Domain;
using Jobby.Server.Entities;
using Microsoft.EntityFrameworkCore;

namespace Jobby.Server.Services
{
    public class HistoryService(IDbContextFactory<AppDbContext> dbContextFactory) : ServiceBase(dbContextFactory), IHistoryService
    {
        public async Task CreateHistory(JobHistoryModel jobHistory)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            await db.JobHistories.AddAsync(new JobHistory()
            {
                AppId = jobHistory.AppId,
                Color = jobHistory.Color,
                Created = DateTime.Now,
                EventTitle = jobHistory.EventTitle,
                EventDescription = jobHistory.EventDescription
            });
            await db.SaveChangesAsync();
        }

        public async Task<List<JobHistoryModel>> GetAllHistory(int appId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            List<JobHistoryModel> jobHistories = await db.JobHistories.Where(h => h.AppId == appId && !h.Disabled).Select(history => new JobHistoryModel
            {
                AppId = history.AppId,
                Color = history.Color,
                EventDate = history.Created,
                EventTitle = history.EventTitle,
                EventDescription = history.EventDescription
            }).ToListAsync();

            return jobHistories;
    }

    }
}
