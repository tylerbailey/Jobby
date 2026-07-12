using Jobby.Infrastructure.Data;
using Jobby.Models.Dto;
using Jobby.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Jobby.Server.Services
{
    public class StageService(IDbContextFactory<AppDbContext> dbContextFactory) : ServiceBase(dbContextFactory), IStageService
    {
        public async Task CreateStageAsync(AppStageModel appStage, string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();

            var existingStages = await db.AppStages
                .Where(s => s.UserId == userId && !s.Disabled)
                .ToListAsync();

            foreach (var stage in existingStages)
                stage.Order++;

            db.AppStages.Add(new AppStage
            {
                UserId = userId,
                Name = appStage.Name,
                Order = 1,
                Color = appStage.Color
            });

            await db.SaveChangesAsync();
        }

        public async Task UpdateStageAsync(AppStageModel appStage, string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var stage = await db.AppStages.Where(s => s.Id == appStage.Id && s.UserId == userId).FirstOrDefaultAsync();
            if (stage != null)
            {
                stage.Name = appStage.Name;
                stage.Color = appStage.Color;
                await db.SaveChangesAsync();
            }
        }

        public async Task ReorderStagesAsync(ReorderStagesRequest request, string userId)
        {
            if (request.Stages.Count == 0)
                return;

            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var stageIds = request.Stages.Select(s => s.Id).ToHashSet();
            var stages = await db.AppStages
                .Where(s => s.UserId == userId && !s.Disabled && stageIds.Contains(s.Id))
                .ToListAsync();

            foreach (var update in request.Stages)
            {
                var stage = stages.FirstOrDefault(s => s.Id == update.Id);
                if (stage != null)
                    stage.Order = update.Order;
            }

            await db.SaveChangesAsync();
        }

        public async Task DeleteStageAsync(int stageId, string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var stage = await db.AppStages.Where(s => s.Id == stageId && s.UserId == userId).FirstOrDefaultAsync();
            if (stage != null && (stage.JobApps == null || stage.JobApps.Count == 0))
            {
                db.AppStages.Remove(stage);
                await db.SaveChangesAsync();
            }
        }

        public async Task<List<AppStageModel>> GetUserPipelineAsync(string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var stages = await db.AppStages
       .Where(s => !s.Disabled && s.UserId == userId)
       .Include(s => s.JobApps.Where(a => a.UserId == userId && !a.Disabled))
           .ThenInclude(a => a.LocationType)
       .Include(s => s.JobApps.Where(a => a.UserId == userId && !a.Disabled))
           .ThenInclude(a => a.JobEvents.Where(e => !e.Disabled))
       .OrderBy(s => s.Order)
       .ToListAsync();

            var result = stages.Select(s => new AppStageModel
            {
                Id = s.Id,
                Name = s.Name,
                Order = s.Order,
                Color = s.Color,
                Items = [.. (s.JobApps ?? []).Where(a => !a.Disabled && !a.IsArchived).Select(a => new UserJobApplicationModel
                {
                    Id = a.Id,
                    CompanyName = a.Company,
                    JobTitle = a.Title,
                    Summary = a.Summary ?? string.Empty,
                    JobPostingUrl = a.JobPostingUrl ?? string.Empty,
                    Address = a.Address ?? string.Empty,
                    Salary = a.Salary,
                    LocationTypeId = a.LocationTypeId,
                    LocationType = a.LocationType?.Type ?? string.Empty,
                    Notes = a.Notes ?? string.Empty,
                    ContactName = a.ContactName ?? string.Empty,
                    AppliedDate = a.Applied.HasValue ? DateTime.SpecifyKind(a.Applied.Value, DateTimeKind.Utc) : null,
                    Status = a.Status,
                    IsArchived = a.IsArchived,
                    StageId = a.StageId,
                    Events = [.. (a.JobEvents ?? []).Where(e => e.EventDate >= DateTime.UtcNow).Select(e => new JobEventModel
                    {
                        Id = e.Id,
                        AppId = e.AppId,
                        EventDate = DateTime.SpecifyKind(e.EventDate, DateTimeKind.Utc),
                        EventTitle = e.EventTitle,
                        EventDescription = e.EventDescription,
                    })]
                })]
            }).ToList();

            return result;
        }
    }
}
