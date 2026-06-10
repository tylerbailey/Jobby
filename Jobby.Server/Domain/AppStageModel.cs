using System.Text.Json.Serialization;

namespace Jobby.Server.Domain
{
    public class AppStageModel
    {
        [JsonPropertyName("id")]
        public int? Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("order")]
        public int Order { get; set; }

        [JsonPropertyName("color")]
        public string Color { get; set; } = string.Empty;

        [JsonPropertyName("items")]
        public List<UserJobApplicationModel> Items { get; set; } = [];
    }
}
