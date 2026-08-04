namespace Jobby.Server.Services;

public interface IOllamaService
{
    /// <summary>Streams a plain-text completion from the Ollama model for the given prompt.</summary>
    Task<string> GenerateTextAsync(string prompt, CancellationToken cancellationToken = default);

    /// <summary>Streams a JSON-formatted chat completion from the Ollama model for the given prompt and optional system prompt.</summary>
    Task<string> GenerateJsonAsync(
        string prompt,
        string? systemPrompt = null,
        CancellationToken cancellationToken = default);
}
