using System.Net.Http.Json;
using System.Text.Json.Serialization;

namespace Jobby.Server.Services;

public class JobScrapeClient(HttpClient httpClient) : IJobScrapeService
{
    private readonly HttpClient _httpClient = httpClient;

    /// <summary>Requests the rendered HTML for a job posting URL from the external scraper service.</summary>
    public async Task<string> ScrapeHtmlAsync(string url, CancellationToken cancellationToken = default)
    {
        var response = await _httpClient.PostAsJsonAsync(
            "/scrape",
            new ScrapeRequest { Url = url },
            cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadFromJsonAsync<ErrorResponse>(cancellationToken);
            throw new InvalidOperationException(error?.Message ?? "Scraper service request failed.");
        }

        var result = await response.Content.ReadFromJsonAsync<ScrapeResponse>(cancellationToken: cancellationToken);
        if (string.IsNullOrWhiteSpace(result?.Html))
            throw new InvalidOperationException("Scraper service returned empty HTML.");

        return result.Html;
    }

    private sealed class ScrapeRequest
    {
        [JsonPropertyName("url")]
        public string Url { get; set; } = string.Empty;
    }

    private sealed class ScrapeResponse
    {
        [JsonPropertyName("html")]
        public string Html { get; set; } = string.Empty;
    }

    private sealed class ErrorResponse
    {
        [JsonPropertyName("message")]
        public string? Message { get; set; }
    }
}
