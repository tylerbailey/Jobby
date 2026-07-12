using System.Text.Json.Serialization;

namespace Jobby.Models.Dto
{
    public class JobHistoryModel
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("appId")]
        public int AppId { get; set; }

        [JsonPropertyName("color")]
        public string Color { get; set; } = string.Empty;

        [JsonPropertyName("eventTitle")]
        public string EventTitle { get; set; } = string.Empty;

        [JsonPropertyName("eventDescription")]
        public string EventDescription { get; set; } = string.Empty;

        [JsonPropertyName("eventDate")]
        public DateTime EventDate { get; set; }
    }
}
