using Jobby.Server.Data;
using Jobby.Server.Domain;
using Jobby.Server.Entities;
using Microsoft.EntityFrameworkCore;

namespace Jobby.Server.Services
{
    public class StageService(IDbContextFactory<AppDbContext> dbContextFactory) : ServiceBase(dbContextFactory), IStageService
    {
        public async Task CreateStage(AppStageModel appStage, string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();

            var conflict = await db.AppStages
                .AnyAsync(s => s.UserId == userId && s.Order == appStage.Order);

            if (conflict)
            {
                var stagesToShift = await db.AppStages
                    .Where(s => s.UserId == userId && s.Order >= appStage.Order)
                    .ToListAsync();

                foreach (var stage in stagesToShift)
                    stage.Order++;
            }

            db.AppStages.Add(new AppStage
            {
                UserId = userId,
                Name = appStage.Name,
                Order = appStage.Order,
                Color = appStage.Color
            });

            await db.SaveChangesAsync();
        }

        public async Task UpdateStage(AppStageModel appStage, string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var stage = await db.AppStages.Where(s => s.Id == appStage.Id && s.UserId == userId).FirstOrDefaultAsync();
            if (stage != null)
            {
                stage.Name = appStage.Name;
                stage.Order = appStage.Order;
                stage.Color = appStage.Color;
                await db.SaveChangesAsync();
            }
        }

        public async Task DeleteStage(int stageId, string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var stage = await db.AppStages.Where(s => s.Id == stageId && s.UserId == userId).FirstOrDefaultAsync();
            if (stage != null && stage.JobApps.Count == 0)
            {
                stage.Disabled = true;
                await db.SaveChangesAsync();
            }
        }

        public async Task<List<AppStageModel>> GetUserPipeline(string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var stages = await db.AppStages.Where(s => !s.Disabled).Select(s => new AppStageModel
            {
                Id = s.Id,
                Name = s.Name,
                Order = s.Order,
                Color = s.Color,
                Items = db.JobApps.Where(a => a.UserId == userId && a.StageId == s.Id).Select(a => new UserJobApplicationModel
                {
                    Id = a.Id,
                    UserId = a.UserId,
                    CompanyName = a.Company,
                    JobTitle = a.Title,
                    JobPostingUrl = a.JobPostingUrl ?? string.Empty,
                    AppliedDate = a.Applied,
                    StageId = a.StageId,
                    LocationType = a.LocationType.Type,
                    LocationTypeId = a.LocationTypeId,
                    Address = a.Address,
                    Salary = a.Salary,
                    UpcomingDate = a.Upcoming,
                    UpcomingType = a.UpcomingType,
                    Notes = a.Notes,
                }).ToList()
            }).OrderBy(s => s.Order).ToListAsync();
            return stages;
        }
    }
}
