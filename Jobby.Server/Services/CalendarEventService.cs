using Jobby.Infrastructure.Data;
using Jobby.Server.Consts;
using Jobby.Models.Dto;
using Jobby.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Jobby.Server.Services
{
    public class CalendarEventService(IDbContextFactory<AppDbContext> dbContextFactory) : ServiceBase(dbContextFactory), ICalendarEventService
    {

        /// <summary>Creates a new calendar event and, if linked to a job, records its creation in the job history.</summary>
        public async Task CreateEventAsync(JobEventModel jobEvent, string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var entry = new CalendarEvent
            {
                UserId = userId,
                JobId = jobEvent.AppId,
                RecruiterId = jobEvent.RecruiterId,
                EventTitle = jobEvent.EventTitle,
                EventDescription = jobEvent.EventDescription,
                EventDate = DateTime.SpecifyKind(jobEvent.EventDate, DateTimeKind.Utc),
                Created = DateTime.UtcNow,
            };
            await db.CalendarEvents.AddAsync(entry);
            if (jobEvent.AppId.HasValue)
            {
                await db.JobHistories.AddAsync(new JobHistory
                {
                    JobId = jobEvent.AppId.Value,
                    Color = Colors.Yellow,
                    EventTitle = "Event Creation",
                    EventDescription = $@"Event ""{jobEvent.EventTitle}"" was created.",
                    Created = DateTime.UtcNow
                });
            }
            await db.SaveChangesAsync();
        }

        /// <summary>Retrieves all active calendar events for the given job application.</summary>
        public async Task<List<JobEventModel>> GetEventsAsync(int appId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            List<JobEventModel> jobEvents = db.CalendarEvents.Where(j => j.JobId == appId && !j.Disabled).Select(j => new JobEventModel()
            {
                Id = j.Id,
              AppId = j.JobId,
              EventTitle = j.EventTitle,
              EventDescription = j.EventDescription,
              EventDate = DateTime.SpecifyKind(j.EventDate, DateTimeKind.Utc)

            }).ToList();
            return jobEvents;
        }

        /// <summary>Retrieves active calendar events for the given job application that occur in the future.</summary>
        public async Task<List<JobEventModel>> GetUpcomingEventsAsync(int appId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            List<JobEventModel> jobEvents = [.. db.CalendarEvents.Where(j => j.JobId == appId && j.EventDate >= DateTime.UtcNow &&!j.Disabled).Select(j => new JobEventModel()
            {
                Id = j.Id,
                AppId = j.JobId,
                EventTitle = j.EventTitle,
                EventDescription = j.EventDescription,
                EventDate = j.EventDate

            })];
            return jobEvents;
        }

        /// <summary>Retrieves all active calendar events across all of the user's job applications, including the related job details.</summary>
        public async Task<List<JobEventModel>> GetUserEventsAsync(string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var events = await db.Jobs.Where(j => j.UserId == userId && j.JobEvents != null && j.JobEvents.Count > 0 && !j.Disabled).SelectMany(j => j.JobEvents.Where(e => !e.Disabled)).Select(e => new JobEventModel()
            {
                Id = e.Id,
                AppId = e.JobId,
                EventTitle = e.EventTitle,
                EventDescription = e.EventDescription,
                EventDate = DateTime.SpecifyKind(e.EventDate, DateTimeKind.Utc),
                JobApplication = new JobModel()
                {
                    Id = e.Job!.Id,
                    CompanyName = e.Job.Company,
                    JobTitle = e.Job.Title,
                    Summary = e.Job.Summary ?? string.Empty,
                    JobPostingUrl = e.Job.JobPostingUrl ?? string.Empty,
                    Address = e.Job.Address ?? string.Empty,
                    Salary = e.Job.Salary,
                    LocationTypeId = e.Job.LocationTypeId,
                    LocationType = (e.Job.LocationType != null ? e.Job.LocationType.Type : string.Empty ),
                    Notes = e.Job.Notes ?? string.Empty,
                    ContactName = e.Job.ContactName ?? string.Empty,
                    AppliedDate = e.Job.Applied.HasValue ? DateTime.SpecifyKind(e.Job.Applied.Value, DateTimeKind.Utc) : null,
                    Status = e.Job.Status,
                    IsArchived = e.Job.IsArchived,
                    StageId = e.Job.StageId,
                }
            }).ToListAsync();

            return events;
        }

        /// <summary>Soft-deletes a calendar event and records the deletion in the job history.</summary>
        public async Task DeleteEventAsync(int eventId, string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var foundEvent = await db.CalendarEvents.Where(e => e.Id == eventId && e.Job!.UserId == userId).FirstOrDefaultAsync();
            if (foundEvent != null && foundEvent.JobId.HasValue)
            {
                foundEvent.Disabled = true;
                await db.JobHistories.AddAsync(new JobHistory
                {
                    JobId = foundEvent.JobId.Value,
                    Color = Colors.Yellow,
                    EventTitle = "Event Deleted",
                    EventDescription = $@"Event ""{foundEvent.EventTitle}"" was deleted.",
                    Created = DateTime.UtcNow
                });
                await db.SaveChangesAsync();
            }

        }

    }
}
