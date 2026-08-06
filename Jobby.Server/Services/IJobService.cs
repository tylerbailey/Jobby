using Jobby.Models.Dto;

namespace Jobby.Server.Services;

public interface IJobService
{
    /// <summary>Archives or unarchives a job application and records the change in the job history.</summary>
    Task ArchiveAppAsync(int appId, bool isArchived, string userId);
    /// <summary>Creates a new job application and records its creation in the job history.</summary>
    Task CreateNewAppAsync(JobDto application, string userId);
    /// <summary>Soft-deletes a job application and records the deletion in the job history.</summary>
    Task DeleteAppAsync(int appId, string userId);
    /// <summary>Edits an uploaded resume document to tailor it toward a job posting using AI-generated text replacements.</summary>
    Task<ResumeGenerationResponse> EditDocxAsync(IFormFile file, string posting);
    /// <summary>Scrapes a job posting URL and uses the AI service to extract structured job posting data.</summary>
    Task<JobPostingDataDto> ScrapeJobPostingAsync(string url, CancellationToken cancellationToken = default);
    /// <summary>Retrieves a single non-archived job application for the given user.</summary>
    Task<JobDto> GetAppAsync(string userId, int applicationId);
    /// <summary>Retrieves all non-archived job applications for the given user.</summary>
    Task<List<JobDto>> GetAppsAsync(string userId);
    /// <summary>Retrieves all archived job applications for the given user.</summary>
    Task<List<JobDto>> GetArchivedAppsAsync(string userId);
    /// <summary>Retrieves the list of available job location types.</summary>
    Task<List<LocationTypeDto>> GetAppLocationsAsync();
    /// <summary>Moves a job application to a different pipeline stage and records the move in the job history.</summary>
    Task MoveApplicationStageAsync(int applicationId, int stageId, string userId);
    /// <summary>Updates an existing job application's fields and records the change in the job history.</summary>
    Task UpdateAppAsync(JobDto application, string userId);
}
