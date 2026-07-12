using System.Text.Json.Serialization;

namespace Jobby.Server.Dto
{
    public class ResumeBlock
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("text")]
        public string Text { get; set; } = string.Empty;

    }
}
