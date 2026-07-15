using System.Text.Json.Serialization;

namespace Jobby.Models.Dto
{
    public class JobEventModel
    {
        [JsonPropertyName("id")]
        public int? Id { get; set; }

        [JsonPropertyName("appId")]
        public int? AppId { get; set; }

        [JsonPropertyName("recruiterId")]
        public int? RecruiterId { get; set; }

        [JsonPropertyName("eventTitle")]
        public string EventTitle { get; set; } = string.Empty;

        [JsonPropertyName("eventDescription")]
        public string EventDescription { get; set; } = string.Empty;

        [JsonPropertyName("eventDate")]
        public DateTime EventDate { get; set; }

        [JsonPropertyName("application")]
        public UserJobApplicationModel JobApplication { get; set; } = new UserJobApplicationModel();
    }
}
