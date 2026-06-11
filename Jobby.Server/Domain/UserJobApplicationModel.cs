using System.Text.Json.Serialization;

namespace Jobby.Server.Domain
{
    public class UserJobApplicationModel
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("userId")]
        public string UserId { get; set; } = string.Empty;

        [JsonPropertyName("companyName")]
        public string CompanyName { get; set; } = string.Empty;

        [JsonPropertyName("title")]
        public string JobTitle { get; set; } = string.Empty;

        [JsonPropertyName("postingUrl")]
        public string JobPostingUrl { get; set; } = string.Empty;

        [JsonPropertyName("locationTypeId")]
        public int LocationTypeId { get; set; }

        [JsonPropertyName("locationType")]
        public string LocationType { get; set; } = string.Empty;

        [JsonPropertyName("address")]
        public string? Address { get; set; }

        [JsonPropertyName("salary")]
        public int? Salary { get; set; }

        [JsonPropertyName("contactName")]
        public string? ContactName { get; set; }

        [JsonPropertyName("stageId")]
        public int? StageId { get; set; }

        [JsonPropertyName("notes")]
        public string? Notes { get; set; }

        [JsonPropertyName("appliedDate")]
        public DateTime? AppliedDate { get; set; }

        [JsonPropertyName("isAccepted")]
        public bool IsAccepted { get; set; }

        [JsonPropertyName("isRejected")]
        public bool IsRejected { get; set; }
    }
}
