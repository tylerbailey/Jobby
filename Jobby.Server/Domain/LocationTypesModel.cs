using System.Text.Json.Serialization;

namespace Jobby.Server.Domain
{
    public class LocationTypesModel
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("type")]
        public string Type { get; set; }
    }
}
