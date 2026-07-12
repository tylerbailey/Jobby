using System.Text.Json.Serialization;

namespace Jobby.Server.Dto;

public class UserAdminModel
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("displayName")]
    public string? DisplayName { get; set; }

    [JsonPropertyName("isApproved")]
    public bool IsApproved { get; set; }

    [JsonPropertyName("emailConfirmed")]
    public bool EmailConfirmed { get; set; }

    [JsonPropertyName("lockoutEnabled")]
    public bool LockoutEnabled { get; set; }

    [JsonPropertyName("lockoutEnd")]
    public DateTimeOffset? LockoutEnd { get; set; }

    [JsonPropertyName("roles")]
    public IList<string> Roles { get; set; } = [];
}

public class UpdateUserAdminRequest
{
    [JsonPropertyName("email")]
    public string? Email { get; set; }

    [JsonPropertyName("displayName")]
    public string? DisplayName { get; set; }

    [JsonPropertyName("isApproved")]
    public bool? IsApproved { get; set; }

    [JsonPropertyName("emailConfirmed")]
    public bool? EmailConfirmed { get; set; }

    [JsonPropertyName("lockoutEnabled")]
    public bool? LockoutEnabled { get; set; }

    [JsonPropertyName("password")]
    public string? Password { get; set; }
}

public class UpdateUserRolesRequest
{
    [JsonPropertyName("roles")]
    public IList<string> Roles { get; set; } = [];
}
