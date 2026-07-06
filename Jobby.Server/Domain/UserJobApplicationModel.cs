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

        [JsonPropertyName("jobTitle")]
        public string JobTitle { get; set; } = string.Empty;

        [JsonPropertyName("summary")]
        public string Summary { get; set; } = string.Empty;

        [JsonPropertyName("jobPostingUrl")]
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

        [JsonPropertyName("status")]
        public int Status { get; set; }

        [JsonPropertyName("isArchived")]
        public bool IsArchived { get; set; }

        [JsonPropertyName("events")]
        public List<JobEventModel> Events { get; set; } = [];

        [JsonPropertyName("recruiter")]
        public RecruiterModel Recruiter { get; set; } = new RecruiterModel();
    }
}
