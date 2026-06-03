using System.Text.Json.Serialization;

namespace Jobby.Server.Domain
{
    public class AppStageModel
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("order")]
        public int Order { get; set; }

        [JsonPropertyName("color")]
        public string Color { get; set; }       

        [JsonPropertyName("items")]
        public List<UserJobApplicationModel> Items { get; set; }
    }
}
