namespace Jobby.Server.Services;

public sealed record IssuedRefreshToken(string Token, DateTimeOffset ExpiresAt);

public sealed record RefreshTokenRotation(bool Succeeded, string? UserId, string? Token, DateTimeOffset? ExpiresAt)
{
    public static RefreshTokenRotation Failed() => new(false, null, null, null);

    public static RefreshTokenRotation Success(string userId, string token, DateTimeOffset expiresAt) =>
        new(true, userId, token, expiresAt);
}

public interface IRefreshTokenService
{
    Task<IssuedRefreshToken> IssueAsync(string userId, CancellationToken cancellationToken = default);

    Task<RefreshTokenRotation> RotateAsync(string rawToken, CancellationToken cancellationToken = default);

    Task RevokeAsync(string? rawToken, CancellationToken cancellationToken = default);
}
