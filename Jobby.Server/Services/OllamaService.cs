using Microsoft.Extensions.Options;
using OllamaSharp;
using OllamaSharp.Models;
using OllamaSharp.Models.Chat;
using System.Text;

namespace Jobby.Server.Services;

public class OllamaService(HttpClient httpClient, IOptions<OllamaOptions> options) : IOllamaService
{
    private readonly OllamaOptions _options = options.Value;
    private readonly OllamaApiClient _client = new(httpClient);

    public async Task<string> GenerateTextAsync(string prompt, CancellationToken cancellationToken = default)
    {
        var request = new GenerateRequest
        {
            Model = _options.TextModel,
            Prompt = prompt,
            Stream = true,
        };

        return await CollectGenerateResponseAsync(request, cancellationToken);
    }

    public async Task<string> GenerateJsonAsync(
        string prompt,
        string? systemPrompt = null,
        CancellationToken cancellationToken = default)
    {
        _client.SelectedModel = _options.TextModel;

        var chat = string.IsNullOrWhiteSpace(systemPrompt)
            ? new Chat(_client)
            : new Chat(_client, systemPrompt);

        chat.Model = _options.TextModel;
        chat.Options = new RequestOptions
        {
            Temperature = 0.2f,
        };

        var response = new StringBuilder();

        await foreach (var token in chat.SendAsync(
                           prompt,
                           tools: null,
                           imagesAsBase64: null,
                           format: "json")
                       .WithCancellation(cancellationToken))
        {
            response.Append(token);
        }

        return response.ToString();
    }

    private async Task<string> CollectGenerateResponseAsync(
        GenerateRequest request,
        CancellationToken cancellationToken)
    {
        var response = new StringBuilder();

        await foreach (var chunk in _client.GenerateAsync(request).WithCancellation(cancellationToken))
        {
            if (!string.IsNullOrEmpty(chunk?.Response))
                response.Append(chunk.Response);
        }

        return response.ToString();
    }
}
