namespace Jobby.Server.Services;

public interface IJobScrapeService
{
    Task<string> ScrapeHtmlAsync(string url, CancellationToken cancellationToken = default);
}
