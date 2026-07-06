using Jobby.Scraper.Models;
using Jobby.Scraper.Services;
using Microsoft.Playwright;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<PageScrapeService>();

var app = builder.Build();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.MapPost("/scrape", async (ScrapeRequest request, PageScrapeService scraper, CancellationToken cancellationToken) =>
{
    if (string.IsNullOrWhiteSpace(request.Url))
        return Results.BadRequest(new { message = "URL is required." });

    try
    {
        var html = await scraper.ScrapeHtmlAsync(request.Url.Trim(), cancellationToken);
        return Results.Ok(new ScrapeResponse { Html = html });
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(new { message = ex.Message });
    }
    catch (PlaywrightException ex)
    {
        return Results.BadRequest(new { message = $"Failed to load page: {ex.Message}" });
    }
});

app.Run();
