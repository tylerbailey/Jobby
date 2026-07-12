using System.Text.Json.Serialization;

namespace Jobby.Models.Dto
{
    public class JobPostingData
    {
        [JsonPropertyName("company")]
        public string Company { get; set; } = string.Empty;

        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [JsonPropertyName("summary")]
        public string Summary { get; set; } = string.Empty;

        [JsonPropertyName("isRemote")]
        public bool IsRemote { get; set; }

        [JsonPropertyName("isHybrid")]
        public bool IsHybrid { get; set; }

        [JsonPropertyName("isOnsite")]
        public bool IsOnsite { get; set; }

        [JsonPropertyName("salaryRange")]
        public string SalaryRange { get; set; } = string.Empty;

        [JsonPropertyName("requiredSkills")]
        public List<string> RequiredSkills { get; set; } = [];

        [JsonPropertyName("preferredSkills")]
        public List<string> PreferredSkills { get; set; } = [];

        [JsonPropertyName("technologies")]
        public List<string> Technologies { get; set; } = [];

        [JsonPropertyName("responsibilities")]
        public List<string> Responsibilities { get; set; } = [];

        [JsonPropertyName("leadershipRequirements")]
        public List<string> LeadershipRequirements { get; set; } = [];

        [JsonPropertyName("experienceRequirements")]
        public List<string> ExperienceRequirements { get; set; } = [];

        [JsonPropertyName("keywords")]
        public List<string> Keywords { get; set; } = [];
    }
}
