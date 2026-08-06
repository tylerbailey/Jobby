using Jobby.Infrastructure.Data;
using Jobby.Models.Dto;
using Jobby.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Jobby.Server.Services
{
    public class StageService(IDbContextFactory<AppDbContext> dbContextFactory) : ServiceBase(dbContextFactory), IStageService
    {
        /// <summary>Creates a new pipeline stage as the first stage and shifts existing stages down.</summary>
        public async Task CreateStageAsync(JobStageDto appStage, string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();

            var existingStages = await db.JobStages
                .Where(s => s.UserId == userId && !s.Disabled)
                .ToListAsync();

            foreach (var stage in existingStages)
                stage.Order++;

            db.JobStages.Add(new JobStage
            {
                UserId = userId,
                Name = appStage.Name,
                Order = 1,
                Color = appStage.Color
            });

            await db.SaveChangesAsync();
        }

        /// <summary>Updates the name and color of an existing pipeline stage.</summary>
        public async Task UpdateStageAsync(JobStageDto appStage, string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var stage = await db.JobStages.Where(s => s.Id == appStage.Id && s.UserId == userId).FirstOrDefaultAsync();
            if (stage != null)
            {
                stage.Name = appStage.Name;
                stage.Color = appStage.Color;
                await db.SaveChangesAsync();
            }
        }

        /// <summary>Updates the display order of the user's pipeline stages.</summary>
        public async Task ReorderStagesAsync(ReorderStagesRequest request, string userId)
        {
            if (request.Stages.Count == 0)
                return;

            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var stageIds = request.Stages.Select(s => s.Id).ToHashSet();
            var stages = await db.JobStages
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

        /// <summary>Deletes a pipeline stage if it has no associated jobs.</summary>
        public async Task DeleteStageAsync(int stageId, string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var stage = await db.JobStages.Where(s => s.Id == stageId && s.UserId == userId).FirstOrDefaultAsync();
            if (stage != null && (stage.Jobs == null || stage.Jobs.Count == 0))
            {
                db.JobStages.Remove(stage);
                await db.SaveChangesAsync();
            }
        }

        /// <summary>Retrieves the user's full pipeline of stages with their associated jobs and upcoming events.</summary>
        public async Task<List<JobStageDto>> GetUserPipelineAsync(string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var stages = await db.JobStages
       .Where(s => !s.Disabled && s.UserId == userId)
       .Include(s => s.Jobs.Where(a => a.UserId == userId && !a.Disabled))
           .ThenInclude(a => a.LocationType)
       .Include(s => s.Jobs.Where(a => a.UserId == userId && !a.Disabled))
           .ThenInclude(a => a.JobEvents.Where(e => !e.Disabled))
       .OrderBy(s => s.Order)
       .ToListAsync();

            var result = stages.Select(s => new JobStageDto
            {
                Id = s.Id,
                Name = s.Name,
                Order = s.Order,
                Color = s.Color,
                Items = [.. (s.Jobs ?? []).Where(a => !a.Disabled && !a.IsArchived).Select(a => new JobDto
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
                    Events = [.. (a.JobEvents ?? []).Where(e => e.EventDate >= DateTime.UtcNow).Select(e => new JobEventDto
                    {
                        Id = e.Id,
                        AppId = e.JobId,
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
