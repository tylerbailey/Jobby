using Microsoft.Extensions.Options;
using System.Net.Http.Headers;

namespace Jobby.Server.Services;

public static class OllamaServiceCollectionExtensions
{
    public static IServiceCollection AddOllama(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<OllamaOptions>(configuration.GetSection("Ollama"));

        services.AddHttpClient<IOllamaService, OllamaService>((sp, client) =>
        {
            var options = sp.GetRequiredService<IOptions<OllamaOptions>>().Value;
            client.BaseAddress = new Uri(options.BaseUrl.TrimEnd('/') + "/");

            if (!string.IsNullOrWhiteSpace(options.ApiKey))
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", options.ApiKey);
        });

        return services;
    }
}
