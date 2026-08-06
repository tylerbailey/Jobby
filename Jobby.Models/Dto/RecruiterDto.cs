using Jobby.Models.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Jobby.Models.Dto
{
    public class RecruiterDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("agency")]
        public string Agency { get; set; } = string.Empty;

        [JsonPropertyName("notes")]
        public string Notes { get; set; } = string.Empty;
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;
        [JsonPropertyName("phoneNumber")]
        public string PhoneNumber { get; set; } = string.Empty;

        [JsonPropertyName("lastContact")]
        public DateTime? LastContact { get; set; }

        [JsonPropertyName("nextContact")]
        public DateTime? NextContact { get; set; }

        [JsonPropertyName("applicationIds")]
        public List<int> ApplicationIds { get; set; } = [];
    }
}
