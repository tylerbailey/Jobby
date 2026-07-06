namespace Jobby.Server.Services;

public class ScraperOptions
{
    public const string SectionName = "Scraper";

    public string BaseUrl { get; set; } = "http://localhost:8081";
}
