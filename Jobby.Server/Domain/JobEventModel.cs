using System.Text.Json.Serialization;

namespace Jobby.Server.Domain
{
    public class JobEventModel
    {
        [JsonPropertyName("id")]

        public int? Id { get; set; }

        [JsonPropertyName("eventTitle")]
        public string EventTitle { get; set; } = string.Empty;

        [JsonPropertyName("eventDescription")]
        public string EventDescription { get; set; } = string.Empty;

        [JsonPropertyName("eventDate")]
        public DateTime EventDate { get; set; }
    }
}
