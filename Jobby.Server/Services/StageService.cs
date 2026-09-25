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

            foreach (var existingStage in existingStages)
                existingStage.Order++;

            var stage = new JobStage
            {
                UserId = userId,
                Name = appStage.Name,
                Order = 1,
                Color = appStage.Color
            };
            db.JobStages.Add(stage);
            await db.SaveChangesAsync();

            var disabledStageIds = await db.JobStages
                .Where(s => s.UserId == userId && s.Disabled)
                .Select(s => s.Id)
                .ToListAsync();

            if (disabledStageIds.Count == 0)
                return;

            var parkedJobs = await db.Jobs
                .Where(job => job.UserId == userId && disabledStageIds.Contains(job.StageId))
                .ToListAsync();

            foreach (var job in parkedJobs)
                job.StageId = stage.Id;

            await db.SaveChangesAsync();

            var disabledStages = await db.JobStages
                .Where(s => s.UserId == userId && s.Disabled)
                .ToListAsync();
            db.JobStages.RemoveRange(disabledStages);
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

        /// <summary>Deletes a pipeline stage. Archived applications move to the first remaining stage, or stay put when this is the last stage.</summary>
        public async Task<string?> DeleteStageAsync(int stageId, string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var stage = await db.JobStages.FirstOrDefaultAsync(s => s.Id == stageId && s.UserId == userId);
            if (stage is null)
                return null;

            var jobsOnStage = await db.Jobs
                .Where(job => job.StageId == stageId && job.UserId == userId)
                .ToListAsync();

            if (jobsOnStage.Any(job => !job.Disabled && !job.IsArchived))
                return "You must remove all applications from the stage before deleting.";

            if (jobsOnStage.Count > 0)
            {
                var destination = await db.JobStages
                    .Where(s => s.UserId == userId && !s.Disabled && s.Id != stageId)
                    .OrderBy(s => s.Order)
                    .ThenBy(s => s.Id)
                    .FirstOrDefaultAsync();

                if (destination is null)
                {
                    stage.Disabled = true;
                    await db.SaveChangesAsync();
                    return null;
                }

                foreach (var job in jobsOnStage)
                    job.StageId = destination.Id;

                await db.SaveChangesAsync();
            }

            db.JobStages.Remove(stage);
            await db.SaveChangesAsync();
            return null;
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
