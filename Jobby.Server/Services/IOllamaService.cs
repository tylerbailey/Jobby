namespace Jobby.Server.Services;

public interface IOllamaService
{
    Task<string> GenerateTextAsync(string prompt, CancellationToken cancellationToken = default);

    Task<string> GenerateJsonAsync(
        string prompt,
        string? systemPrompt = null,
        CancellationToken cancellationToken = default);
}
