using System.Text.Json.Serialization;

namespace Jobby.Scraper.Models;

public class ScrapeRequest
{
    [JsonPropertyName("url")]
    public string Url { get; set; } = string.Empty;
}

public class ScrapeResponse
{
    [JsonPropertyName("html")]
    public string Html { get; set; } = string.Empty;
}
