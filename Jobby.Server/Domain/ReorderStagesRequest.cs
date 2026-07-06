using System.Text.Json.Serialization;

namespace Jobby.Server.Domain;

public class ReorderStagesRequest
{
    [JsonPropertyName("stages")]
    public List<StageOrderItem> Stages { get; set; } = [];
}

public class StageOrderItem
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("order")]
    public int Order { get; set; }
}
