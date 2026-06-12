using Jobby.Server.Data;
using Jobby.Server.Domain;
using Jobby.Server.Entities;
using Microsoft.EntityFrameworkCore;

namespace Jobby.Server.Services
{
    public class EventService(IDbContextFactory<AppDbContext> dbContextFactory) : ServiceBase(dbContextFactory), IEventService
    {

        public async Task CreateEventAsync(JobEventModel jobEvent)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            await db.JobEvents.AddAsync(new JobEvent
            {
                AppId = jobEvent.AppId,
                EventTitle = jobEvent.EventTitle,
                EventDescription = jobEvent.EventDescription,
                Created = DateTime.UtcNow
            });
            await db.SaveChangesAsync();
        }

        public async Task<List<JobEventModel>> GetEventsAsync(int appId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            List<JobEventModel> jobEvents = db.JobEvents.Where(j => j.AppId == appId && !j.Disabled).Select(j => new JobEventModel()
            {
                Id = j.Id,
              AppId = j.AppId,
              EventTitle = j.EventTitle,
              EventDescription = j.EventDescription,
              EventDate = j.EventDate

            }).ToList();
            return jobEvents;
        }

        public async Task<List<JobEventModel>> GetUpcomingEventsAsync(int appId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            List<JobEventModel> jobEvents = db.JobEvents.Where(j => j.AppId == appId && j.EventDate >= DateTime.UtcNow.AddDays(-14) &&!j.Disabled).Select(j => new JobEventModel()
            {
                Id = j.Id,
                AppId = j.AppId,
                EventTitle = j.EventTitle,
                EventDescription = j.EventDescription,
                EventDate = j.EventDate

            }).ToList();
            return jobEvents;
        }

    }
}
