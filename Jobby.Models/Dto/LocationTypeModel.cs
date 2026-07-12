using System.Text.Json.Serialization;

namespace Jobby.Server.Dto
{
    public class LocationTypeModel
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("type")]
        public string Type { get; set; } = string.Empty;
    } 
}
