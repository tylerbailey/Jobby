using Microsoft.Extensions.Options;

namespace Jobby.Server.Services;

public static class ScraperServiceCollectionExtensions
{
    public static IServiceCollection AddScraperClient(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<ScraperOptions>(configuration.GetSection(ScraperOptions.SectionName));

        services.AddHttpClient<IJobScrapeService, JobScrapeClient>((sp, client) =>
        {
            var options = sp.GetRequiredService<IOptions<ScraperOptions>>().Value;
            client.BaseAddress = new Uri(options.BaseUrl.TrimEnd('/') + "/");
            client.Timeout = TimeSpan.FromMinutes(2);
        });

        return services;
    }
}
