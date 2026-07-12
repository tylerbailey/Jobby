using System.Text.Json.Serialization;

namespace Jobby.Server.Dto;

public class ScrapeJobPostingRequest
{
    [JsonPropertyName("url")]
    public string Url { get; set; } = string.Empty;
}
