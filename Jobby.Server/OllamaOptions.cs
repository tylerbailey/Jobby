namespace Jobby.Server;

public class OllamaOptions
{
    public string ApiKey { get; set; } = string.Empty;

    public string BaseUrl { get; set; } = "https://ollama.com";

    public string TextModel { get; set; } = "gpt-oss:120b";

    public string VisionModel { get; set; } = "gpt-oss:120b";
}
