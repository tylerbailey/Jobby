namespace Jobby.Server.Services;

public interface IJobScrapeService
{
    /// <summary>Requests the rendered HTML for a job posting URL from the external scraper service.</summary>
    Task<string> ScrapeHtmlAsync(string url, CancellationToken cancellationToken = default);
}
