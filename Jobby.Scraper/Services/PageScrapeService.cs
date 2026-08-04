using Microsoft.Playwright;

namespace Jobby.Scraper.Services;

public class PageScrapeService
{
    public async Task<string> ScrapeHtmlAsync(string url, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri)
            || (uri.Scheme != Uri.UriSchemeHttps && uri.Scheme != Uri.UriSchemeHttp))
        {
            throw new ArgumentException("A valid http or https URL is required.", nameof(url));
        }

        using var playwright = await Playwright.CreateAsync();
        await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
        {
            Headless = true,
            Args = ["--no-sandbox", "--disable-dev-shm-usage"],
        });

        var page = await browser.NewPageAsync();
        await page.GotoAsync(uri.ToString(), new PageGotoOptions
        {
            WaitUntil = WaitUntilState.Load,
            Timeout = 45_000,
        });

        await page.WaitForSelectorAsync("body", new PageWaitForSelectorOptions
        {
            Timeout = 15_000,
        });

        cancellationToken.ThrowIfCancellationRequested();

        return await page.ContentAsync();
    }
}
