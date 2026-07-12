using System.Text.Json.Serialization;

namespace Jobby.Server.Dto
{
    public class ProfileStatsModel
    {
        [JsonPropertyName("totalAdded")]
        public int TotalAdded { get; set; }

        [JsonPropertyName("totalApplied")]
        public int TotalApplied { get; set; }

        [JsonPropertyName("dailyStats")]
        public List<DailyStatModel> DailyStats { get; set; } = [];
    }

    public class DailyStatModel
    {
        [JsonPropertyName("date")]
        public string Date { get; set; } = string.Empty;

        [JsonPropertyName("added")]
        public int Added { get; set; }

        [JsonPropertyName("applied")]
        public int Applied { get; set; }
    }
}
