using System.Text.Json.Serialization;

namespace Jobby.Models.Dto
{
    public class ResumeEdit
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("newText")]
        public string NewText { get; set; } = string.Empty;
    }
}
