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
            var entry = new JobEvent
            {
                AppId = jobEvent.AppId,
                EventTitle = jobEvent.EventTitle,
                EventDescription = jobEvent.EventDescription,
                EventDate = DateTime.SpecifyKind(jobEvent.EventDate, DateTimeKind.Utc),
                Created = DateTime.UtcNow,
            };

            await db.JobEvents.AddAsync(entry);
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
              EventDate = DateTime.SpecifyKind(j.EventDate, DateTimeKind.Utc)

            }).ToList();
            return jobEvents;
        }

        public async Task<List<JobEventModel>> GetUpcomingEventsAsync(int appId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            List<JobEventModel> jobEvents = [.. db.JobEvents.Where(j => j.AppId == appId && j.EventDate >= DateTime.UtcNow &&!j.Disabled).Select(j => new JobEventModel()
            {
                Id = j.Id,
                AppId = j.AppId,
                EventTitle = j.EventTitle,
                EventDescription = j.EventDescription,
                EventDate = j.EventDate

            })];
            return jobEvents;
        }

        public async Task<List<JobEventModel>> GetUserEvents(string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var events = await db.JobApps.Where(j => j.UserId == userId && j.JobEvents.Count > 0 && !j.Disabled).SelectMany(j => j.JobEvents.Where(e => !e.Disabled)).Select(e => new JobEventModel()
            {
                Id = e.Id,
                AppId = e.AppId,
                EventTitle = e.EventTitle,
                EventDescription = e.EventDescription,
                EventDate = DateTime.SpecifyKind(e.EventDate, DateTimeKind.Utc),
                JobApplication = new UserJobApplicationModel()
                {
                    Id = e.JobApp!.Id,
                    CompanyName = e.JobApp.Company,
                    JobTitle = e.JobApp.Title,
                    JobPostingUrl = e.JobApp.JobPostingUrl ?? string.Empty,
                    Address = e.JobApp.Address ?? string.Empty,
                    Salary = e.JobApp.Salary,
                    LocationTypeId = e.JobApp.LocationTypeId,
                    LocationType = (e.JobApp.LocationType != null ? e.JobApp.LocationType.Type : string.Empty ),
                    Notes = e.JobApp.Notes ?? string.Empty,
                    ContactName = e.JobApp.ContactName ?? string.Empty,
                    AppliedDate = e.JobApp.Applied.HasValue ? DateTime.SpecifyKind(e.JobApp.Applied.Value, DateTimeKind.Utc) : null,
                    Status = e.JobApp.Status,
                    IsArchived = e.JobApp.IsArchived,
                    StageId = e.JobApp.StageId,
                }
            }).ToListAsync();

            return events;
        }

        public async Task DeleteEvent(int eventId, string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var foundEvent = await db.JobEvents.Where(e => e.Id == eventId && e.JobApp!.UserId == userId).FirstOrDefaultAsync();
            if (foundEvent != null)
            {
                foundEvent.Disabled = true;
                await db.SaveChangesAsync();
            }

        }

    }
}
