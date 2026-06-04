using Jobby.Server.Data;
using Jobby.Server.Domain;
using Jobby.Server.Entities;
using Microsoft.EntityFrameworkCore;

namespace Jobby.Server.Services
{
    public class AppService(IDbContextFactory<AppDbContext> dbContextFactory) : ServiceBase(dbContextFactory), IAppService
    {
        public async Task<List<UserJobApplicationModel>> GetAppsAsync(string userId)
        {
            var applications = new List<UserJobApplicationModel>();
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            applications = await db.JobApps.Where(a => a.UserId == userId).Select(a => new UserJobApplicationModel
            {
                Id = a.Id,
                CompanyName = a.Company,
                JobTitle = a.Title,
                JobPostingUrl = a.JobPostingUrl ?? string.Empty,
                StageId = a.StageId
            }).ToListAsync();
            return applications;
        }

        public async Task<UserJobApplicationModel> GetAppAsync(string userId, int applicationId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var application = await db.JobApps.Where(a => a.UserId == userId && a.Id == applicationId).Select(a => new UserJobApplicationModel
            {
                Id = a.Id,
                CompanyName = a.Company,
                JobTitle = a.Title,
                JobPostingUrl = a.JobPostingUrl ?? string.Empty,
                StageId = a.StageId
            }).FirstOrDefaultAsync() ?? new UserJobApplicationModel();
            return application;
        }

        public async Task CreateNewAppAsync(UserJobApplicationModel application)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var startingStage = await db.AppStages.Where(s => !s.Disabled).OrderBy(s => s.Order).FirstOrDefaultAsync() ?? new AppStage();
            await db.JobApps.AddAsync(new JobApp()
            {
                UserId = application.UserId,
                Company = application.CompanyName,
                Title = application.JobTitle,
                Address = application.Address,
                JobPostingUrl = application.JobPostingUrl,
                StageId = application.StageId.HasValue ? application.StageId.Value : startingStage.Id,
                Salary = application.Salary,
                LocationTypeId = application.LocationTypeId
                
            });
            await db.SaveChangesAsync();
        }

        public async Task DeleteAppAsync(int appId, string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var application = await db.JobApps.FirstOrDefaultAsync(a => a.Id == appId && a.UserId == userId);
            if (application != null)
            {
                db.JobApps.Remove(application);
                await db.SaveChangesAsync();
            }
        }

        public async Task UpdateAppAsync(UserJobApplicationModel application)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var jobApp = await db.JobApps.FirstOrDefaultAsync(a => a.Id == application.Id);
            if (jobApp != null)
            {
                jobApp.Company = application.CompanyName;
                jobApp.Title = application.JobTitle;
                jobApp.JobPostingUrl = application.JobPostingUrl;
                jobApp.StageId = application.StageId ?? jobApp.StageId;
                jobApp.Salary = application.Salary;
                jobApp.LocationTypeId = application.LocationTypeId;
                jobApp.Address = application.Address;
                jobApp.Applied = application.AppliedDate;
                jobApp.Upcoming = application.UpcomingDate;
                jobApp.UpcomingType = application.UpcomingType;
                jobApp.Modified = DateTime.UtcNow;
                db.JobApps.Update(jobApp);
            }
            await db.SaveChangesAsync();
        }


        public async Task<List<LocationTypesModel>> GetAppLocations()
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var locations = await db.LocationTypes.Where(l => !l.Disabled).Select(l => new LocationTypesModel
            {
                Id = l.Id,
                Type = l.Type
            }).ToListAsync();
            return locations;
        }
    }
}

