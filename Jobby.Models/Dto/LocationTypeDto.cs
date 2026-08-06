using System.Text.Json.Serialization;

namespace Jobby.Models.Dto
{
    public class LocationTypeDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("type")]
        public string Type { get; set; } = string.Empty;
    } 
}
