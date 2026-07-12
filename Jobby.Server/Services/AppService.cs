using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Jobby.Infrastructure.Data;
using Jobby.Server.Consts;
using Jobby.Models.Dto;
using Jobby.Models.Entities;
using Jobby.Server.Helpers;
using Microsoft.EntityFrameworkCore;
using NJsonSchema;
using System.Text.Json;

namespace Jobby.Server.Services
{
    public class AppService(IDbContextFactory<AppDbContext> dbContextFactory, IOllamaService ollamaService, IJobScrapeService jobScrapeService) : ServiceBase(dbContextFactory), IAppService
    {
        private readonly IOllamaService _ollamaService = ollamaService;
        private readonly IJobScrapeService _jobScrapeService = jobScrapeService;

        public async Task<UserJobApplicationModel> GetAppAsync(string userId, int applicationId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var application = await db.JobApps.Where(a => a.UserId == userId && a.Id == applicationId && !a.Disabled && !a.IsArchived).Select(a => new UserJobApplicationModel
            {
                Id = a.Id,
                CompanyName = a.Company,
                JobTitle = a.Title,
                Summary = a.Summary ?? string.Empty,
                JobPostingUrl = a.JobPostingUrl ?? string.Empty,
                Address = a.Address ?? string.Empty,
                Salary = a.Salary,
                LocationTypeId = a.LocationTypeId,
                LocationType = a.LocationType != null ? a.LocationType.Type : string.Empty,
                Notes = a.Notes ?? string.Empty,
                ContactName = a.ContactName ?? string.Empty,
                AppliedDate = a.Applied.HasValue ? DateTime.SpecifyKind(a.Applied.Value, DateTimeKind.Utc) : null,
                Status = a.Status,
                IsArchived = a.IsArchived,
                StageId = a.StageId
            }).FirstOrDefaultAsync() ?? new UserJobApplicationModel();
            return application;
        }

        public async Task<List<UserJobApplicationModel>> GetAppsAsync(string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var applications = await db.JobApps.Where(j => j.UserId == userId && !j.Disabled && !j.IsArchived).Select(j =>
                new UserJobApplicationModel()
                {
                    Id = j.Id,
                    CompanyName = j.Company,
                    JobTitle = j.Title,
                    Summary = j.Summary ?? string.Empty,
                    JobPostingUrl = j.JobPostingUrl ?? string.Empty,
                    Address = j.Address ?? string.Empty,
                    Salary = j.Salary,
                    LocationTypeId = j.LocationTypeId,
                    LocationType = j.LocationType != null ? j.LocationType.Type : string.Empty,
                    Notes = j.Notes ?? string.Empty,
                    ContactName = j.ContactName ?? string.Empty,
                    AppliedDate = j.Applied.HasValue ? DateTime.SpecifyKind(j.Applied.Value, DateTimeKind.Utc) : null,
                    CreatedDate = DateTime.SpecifyKind(j.Created, DateTimeKind.Utc),
                    Status = j.Status,
                    IsArchived = j.IsArchived,
                    StageId = j.StageId
                }
                ).ToListAsync();
            return applications;
        }

        public async Task CreateNewAppAsync(UserJobApplicationModel application, string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var startingStage = await db.AppStages.Where(s => !s.Disabled && s.UserId == userId).OrderBy(s => s.Order).FirstOrDefaultAsync() ?? new AppStage();
            var newJobApp = new JobApp()
            {
                UserId = userId,
                Company = application.CompanyName,
                Title = application.JobTitle,
                Summary = application.Summary,
                JobPostingUrl = application.JobPostingUrl,
                Address = application.Address,
                Salary = application.Salary,
                LocationTypeId = application.LocationTypeId,
                Notes = application.Notes,
                Applied = application.AppliedDate.HasValue ? DateTime.SpecifyKind(application.AppliedDate.Value, DateTimeKind.Utc) : null,
                ContactName = application.ContactName,
                Status = application.Status,
                IsArchived = false,
                StageId = application.StageId ?? startingStage.Id,
                Created = DateTime.UtcNow
            };
            await db.JobApps.AddAsync(newJobApp);
            await db.SaveChangesAsync();

            await db.JobHistories.AddAsync(new JobHistory
            {
                AppId = newJobApp.Id,
                Color = Colors.Purple,
                EventTitle = "Creation",
                EventDescription = "Application was created.",
                Created = DateTime.UtcNow
            });
            await db.SaveChangesAsync();

        }

        public async Task DeleteAppAsync(int appId, string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var application = await db.JobApps.FirstOrDefaultAsync(a => a.Id == appId && a.UserId == userId);
            if (application != null)
            {
                application.Disabled = true;
                await db.JobHistories.AddAsync(new JobHistory
                {
                    AppId = application.Id,
                    Color = Colors.Blue,
                    EventTitle = "Deleted",
                    EventDescription = "Application was deleted.",
                    Created = DateTime.UtcNow
                });
                await db.SaveChangesAsync();
            }
        }

        public async Task UpdateAppAsync(UserJobApplicationModel application, string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var jobApp = await db.JobApps.FirstOrDefaultAsync(a => a.Id == application.Id && a.UserId == userId);
            if (jobApp != null)
            {
                jobApp.Company = application.CompanyName;
                jobApp.Title = application.JobTitle;
                jobApp.Summary = application.Summary;
                jobApp.JobPostingUrl = application.JobPostingUrl;
                jobApp.StageId = application.StageId ?? jobApp.StageId;
                jobApp.Salary = application.Salary;
                jobApp.LocationTypeId = application.LocationTypeId;
                jobApp.Address = application.Address;
                jobApp.Applied = application.AppliedDate.HasValue ? DateTime.SpecifyKind(application.AppliedDate.Value, DateTimeKind.Utc) : null;
                jobApp.ContactName = application.ContactName;
                jobApp.Notes = application.Notes;
                jobApp.Modified = DateTime.UtcNow;
                jobApp.Status = application.Status;
                jobApp.IsArchived = application.IsArchived;
                db.JobApps.Update(jobApp);

                await db.JobHistories.AddAsync(new JobHistory
                {
                    AppId = jobApp.Id,
                    Color = Colors.Green,
                    EventTitle = "Application Updated.",
                    EventDescription = "Application was updated.",
                    Created = DateTime.UtcNow,
                });
                await db.SaveChangesAsync();
            }
        }

        public async Task MoveApplicationStageAsync(int applicationId, int stageId, string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var application = await db.JobApps.Where(a => a.Id == applicationId && a.UserId == userId).FirstOrDefaultAsync();
            if (application != null)
            {
                var stage = db.AppStages.Where(a => a.Id == application.StageId && a.UserId == userId).FirstOrDefault();
                var newStage = db.AppStages.Where(a => a.Id == stageId && a.UserId == userId).FirstOrDefault();

                db.JobHistories.Add(new JobHistory
                {
                    AppId = applicationId,
                    Color = Colors.Blue,
                    EventTitle = "Moved Stage",
                    EventDescription = $"Application moved from stage {stage?.Name ?? "unknown"} to stage {newStage?.Name ?? "unknown"}.",
                    Created = DateTime.UtcNow,

                });
                application?.StageId = stageId;
                await db.SaveChangesAsync();
            }
        }

        public async Task<List<LocationTypeModel>> GetAppLocationsAsync()
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var locations = await db.LocationTypes.Where(l => !l.Disabled).Select(l => new LocationTypeModel
            {
                Id = l.Id,
                Type = l.Type
            }).ToListAsync();
            return locations;
        }

        public async Task<JobPostingData> ScrapeJobPostingAsync(string url, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(url))
                throw new ArgumentException("URL is required.", nameof(url));

            if (!Uri.TryCreate(url, UriKind.Absolute, out var uri)
                || (uri.Scheme != Uri.UriSchemeHttps && uri.Scheme != Uri.UriSchemeHttp))
            {
                throw new ArgumentException("A valid http or https URL is required.", nameof(url));
            }

            var html = await _jobScrapeService.ScrapeHtmlAsync(uri.ToString(), cancellationToken);
            var schema = JsonSchema.FromType<JobPostingData>();
            var prompt = $"""
                {ResumePrompts.JobPosting(html)}

                JSON Schema:
                {schema.ToJson()}
                """;

            var response = await _ollamaService.GenerateJsonAsync(
                prompt,
                "You extract structured job posting data. Return only valid JSON.",
                cancellationToken);

            var postingData = JsonSerializer.Deserialize<JobPostingData>(
                JsonHelpers.RemoveFence(response),
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            return postingData ?? throw new InvalidOperationException("The AI response could not be parsed.");
        }

        public async Task<ResumeGenerationResponse> EditDocxAsync(IFormFile file, string posting)
        {
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            var blockMap = new Dictionary<int, string>();
            var changes = new List<ResumeChange>();

            using (var wordDoc = WordprocessingDocument.Open(memoryStream, true))
            {
                var data = wordDoc.MainDocumentPart!.Document!.Body;
                var paragraphs = data!.Descendants<Paragraph>().ToList();
                var blocks = DocxHelper.GetResumeBlocks(wordDoc);
                foreach (var block in blocks)
                {
                    blockMap[block.Id] = block.Text;
                }

                var jobPostingPrompt = ResumePrompts.JobPosting(posting);
                var jobPostingData = await _ollamaService.GenerateTextAsync(jobPostingPrompt);

                var resumeData = JsonSerializer.Serialize(blocks, new JsonSerializerOptions { WriteIndented = true });
                var resumeEditingPrompt = ResumePrompts.ResumeEditing(jobPostingData, resumeData);
                var resumeEditResponse = await _ollamaService.GenerateTextAsync(resumeEditingPrompt);
                var resumeEdits = JsonSerializer.Deserialize<List<ResumeEdit>>(JsonHelpers.RemoveFence(resumeEditResponse), new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? [];

                var paragraphMap = new Dictionary<int, Paragraph>();

                for (int i = 0; i < paragraphs?.Count; i++)
                {
                    paragraphMap[i] = paragraphs[i];
                }
                foreach (var edit in resumeEdits)
                {
                    if (!paragraphMap.TryGetValue(edit.Id, out var paragraph))
                        continue;

                    var originalText = blockMap.GetValueOrDefault(edit.Id, string.Empty);
                    DocxHelper.ReplaceParagraphText(paragraph, edit.NewText);
                    changes.Add(new ResumeChange
                    {
                        Id = edit.Id,
                        OriginalText = originalText,
                        NewText = edit.NewText
                    });
                }
                wordDoc.MainDocumentPart!.Document.Save();
            }
            memoryStream.Position = 0;

            return new ResumeGenerationResponse
            {
                DocumentBase64 = Convert.ToBase64String(memoryStream.ToArray()),
                Changes = changes
            };
        }

        public async Task ArchiveAppAsync(int appId, bool isArchived, string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var jobApp = await db.JobApps.FirstOrDefaultAsync(a => a.Id == appId && a.UserId == userId);
            if (jobApp is null)
                return;

            jobApp.IsArchived = isArchived;
            await db.JobHistories.AddAsync(new JobHistory
            {
                AppId = jobApp.Id,
                Color = isArchived ? Colors.Gray : Colors.Olive,
                EventTitle = isArchived ? "Application archived" : "Application removed from archive",
                EventDescription = isArchived ? "Application marked as archived" : "Application was unarchived",
                Created = DateTime.UtcNow,
            });
            await db.SaveChangesAsync();
        }

        public async Task<List<UserJobApplicationModel>> GetArchivedAppsAsync(string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var applications = await db.JobApps.Where(j => j.UserId == userId && !j.Disabled && j.IsArchived).Select(j =>
                new UserJobApplicationModel()
                {
                    Id = j.Id,
                    CompanyName = j.Company,
                    JobTitle = j.Title,
                    Summary = j.Summary ?? string.Empty,
                    JobPostingUrl = j.JobPostingUrl ?? string.Empty,
                    Address = j.Address ?? string.Empty,
                    Salary = j.Salary,
                    LocationTypeId = j.LocationTypeId,
                    LocationType = j.LocationType != null ? j.LocationType.Type : string.Empty,
                    Notes = j.Notes ?? string.Empty,
                    ContactName = j.ContactName ?? string.Empty,
                    AppliedDate = j.Applied.HasValue ? DateTime.SpecifyKind(j.Applied.Value, DateTimeKind.Utc) : null,
                    CreatedDate = DateTime.SpecifyKind(j.Created, DateTimeKind.Utc),
                    Status = j.Status,
                    IsArchived = j.IsArchived,
                    StageId = j.StageId
                }
                ).ToListAsync();
            return applications;
        }
    }
}

