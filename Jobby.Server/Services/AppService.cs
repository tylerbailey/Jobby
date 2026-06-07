using DocumentFormat.OpenXml.ExtendedProperties;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Google.GenAI;
using Jobby.Server.Data;
using Jobby.Server.Domain;
using Jobby.Server.Entities;
using Jobby.Server.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Text.Json;

namespace Jobby.Server.Services
{
    public class AppService(IDbContextFactory<AppDbContext> dbContextFactory, IOptions<ApiKeys> settings) : ServiceBase(dbContextFactory), IAppService
    {
        private readonly ApiKeys _options = settings.Value;
        public async Task<List<UserJobApplicationModel>> GetAppsAsync(string userId)
        {
            var applications = new List<UserJobApplicationModel>();
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            applications = await db.JobApps.Where(a => a.UserId == userId && !a.Disabled).Select(a => new UserJobApplicationModel
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
            var application = await db.JobApps.Where(a => a.UserId == userId && a.Id == applicationId && !a.Disabled).Select(a => new UserJobApplicationModel
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
                LocationTypeId = application.LocationTypeId,
                Notes = application.Notes

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
                jobApp.Notes = application.Notes;
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

        public async Task<MemoryStream> EditDocx(IFormFile file, string jobPostingUrl)
        {
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            using (var wordDoc = WordprocessingDocument.Open(memoryStream, true))
            {
                var data = wordDoc.MainDocumentPart!.Document!.Body;
                var paragraphs = data!.Descendants<Paragraph>().ToList();
                var blocks = DocxHelper.GetResumeBlocks(wordDoc);
                var geminiClient = new Client(apiKey: _options.Gemini);

                using var htmlClient = new HttpClient();

                var scrapedHtml = await htmlClient.GetStringAsync(jobPostingUrl);
                var jobPostingPrompt = ResumePrompts.JobPosting(scrapedHtml);
                var geminiResponse = await geminiClient.Models.GenerateContentAsync(model: "gemini-3.5-flash", contents: jobPostingPrompt);
                var jobPostingData = geminiResponse.Text ?? string.Empty;

                var resumeData = JsonSerializer.Serialize(blocks, new JsonSerializerOptions { WriteIndented = true });
                var resumeEditingPrompt = ResumePrompts.ResumeEditing(jobPostingData, resumeData);
                geminiResponse = await geminiClient.Models.GenerateContentAsync(model: "gemini-3.5-flash", contents: resumeEditingPrompt);
                var resumeEdits = JsonSerializer.Deserialize<List<ResumeEdit>>(JsonHelpers.RemoveFence(geminiResponse.Text ?? string.Empty), new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? [];

                var paragraphMap = new Dictionary<int, Paragraph>();

                for (int i = 0; i < paragraphs?.Count; i++)
                {
                    paragraphMap[i] = paragraphs[i];
                }
                foreach (var edit in resumeEdits)
                {
                    if (!paragraphMap.TryGetValue(edit.Id, out var paragraph))
                        continue;
                    DocxHelper.ReplaceParagraphText(paragraph, edit.NewText);
                }
                wordDoc.MainDocumentPart!.Document.Save();
            }
            memoryStream.Position = 0;

            return memoryStream;
        }
    }
}

