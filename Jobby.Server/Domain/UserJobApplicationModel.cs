using System.Text.Json.Serialization;

namespace Jobby.Server.Domain
{
    public class UserJobApplicationModel
    {
        [JsonPropertyName("id")]
        public int? Id { get; set; }

        [JsonPropertyName("userId")]
        public string UserId { get; set; }

        [JsonPropertyName("companyName")]
        public string CompanyName { get; set; }

        [JsonPropertyName("title")]
        public string JobTitle { get; set; }

        [JsonPropertyName("postingUrl")]
        public string JobPostingUrl { get; set; }

        [JsonPropertyName("locationTypeId")]
        public int LocationTypeId { get; set; }

        [JsonPropertyName("locationType")]
        public string LocationType { get; set; }

        [JsonPropertyName("address")]
        public string? Address { get; set; }

        [JsonPropertyName("salary")]
        public int? Salary { get; set; }

        [JsonPropertyName("appliedDate")]
        public DateTime? AppliedDate { get; set; }

        [JsonPropertyName("upcomingDate")]
        public DateTime? UpcomingDate { get; set; }

        [JsonPropertyName("upcomingType")]
        public string? UpcomingType { get; set; }

        [JsonPropertyName("contactName")]
        public string? ContactName { get; set; }

        [JsonPropertyName("lastContactDate")]
        public DateTime? LastContactDate { get; set; }

        [JsonPropertyName("nextContactDate")]
        public DateTime? NextContactDate { get; set; }

        [JsonPropertyName("stageId")]
        public int? StageId { get; set; }

        [JsonPropertyName("notes")]
        public string? Notes { get; set; }

        [JsonPropertyName("showAlertBadge")]
        public bool showAlertBadge { get; set; }
    }
}
