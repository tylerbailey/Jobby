using System.Text.Json.Serialization;

namespace Jobby.Models.Dto;

public class ScrapeJobPostingRequest
{
    [JsonPropertyName("url")]
    public string Url { get; set; } = string.Empty;
}
