using Jobby.Infrastructure.Data;
using Jobby.Models.Entities;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;
using System.Text;

namespace Jobby.Server.Services;

public class RefreshTokenService(IDbContextFactory<AppDbContext> dbContextFactory, IOptions<JwtOptions> jwtOptions) : IRefreshTokenService
{
    private readonly IDbContextFactory<AppDbContext> _dbContextFactory = dbContextFactory;
    private readonly JwtOptions _jwtOptions = jwtOptions.Value;

    /// <summary>Creates a new refresh token for the user and stores only its hash.</summary>
    public async Task<IssuedRefreshToken> IssueAsync(string userId, CancellationToken cancellationToken = default)
    {
        await using var db = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
        await DeleteExpiredAsync(db, userId, cancellationToken);

        var raw = GenerateRawToken();
        var expiresAt = DateTime.UtcNow.AddMinutes(RefreshLifetimeMinutes);
        db.RefreshTokens.Add(new RefreshToken
        {
            UserId = userId,
            TokenHash = HashToken(raw),
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = expiresAt
        });
        await db.SaveChangesAsync(cancellationToken);

        return new IssuedRefreshToken(raw, new DateTimeOffset(expiresAt));
    }

    /// <summary>Validates a refresh token and replaces it with a new one when it is still active.</summary>
    public async Task<RefreshTokenRotation> RotateAsync(string rawToken, CancellationToken cancellationToken = default)
    {
        await using var db = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
        var existing = await db.RefreshTokens
            .FirstOrDefaultAsync(token => token.TokenHash == HashToken(rawToken), cancellationToken);

        if (existing is null)
            return RefreshTokenRotation.Failed();

        if (existing.RevokedAt is not null)
        {
            await RevokeActiveAsync(db, existing.UserId, cancellationToken);
            return RefreshTokenRotation.Failed();
        }

        if (existing.ExpiresAt <= DateTime.UtcNow)
        {
            existing.RevokedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(cancellationToken);
            return RefreshTokenRotation.Failed();
        }

        existing.RevokedAt = DateTime.UtcNow;

        var raw = GenerateRawToken();
        var expiresAt = DateTime.SpecifyKind(existing.ExpiresAt, DateTimeKind.Utc);
        db.RefreshTokens.Add(new RefreshToken
        {
            UserId = existing.UserId,
            TokenHash = HashToken(raw),
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = expiresAt
        });
        await db.SaveChangesAsync(cancellationToken);

        return RefreshTokenRotation.Success(existing.UserId, raw, new DateTimeOffset(expiresAt));
    }

    /// <summary>Revokes the refresh token presented at logout.</summary>
    public async Task RevokeAsync(string? rawToken, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(rawToken))
            return;

        await using var db = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
        var existing = await db.RefreshTokens
            .FirstOrDefaultAsync(token => token.TokenHash == HashToken(rawToken), cancellationToken);

        if (existing is null || existing.RevokedAt is not null)
            return;

        existing.RevokedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(cancellationToken);
    }

    private int RefreshLifetimeMinutes =>
        _jwtOptions.RefreshExpiryInMinutes > 0 ? _jwtOptions.RefreshExpiryInMinutes : 10080;

    private static string GenerateRawToken() =>
        WebEncoders.Base64UrlEncode(RandomNumberGenerator.GetBytes(32));

    private static string HashToken(string rawToken)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(rawToken));
        return Convert.ToHexString(bytes);
    }

    private static async Task DeleteExpiredAsync(AppDbContext db, string userId, CancellationToken cancellationToken)
    {
        await db.RefreshTokens
            .Where(token => token.UserId == userId && token.ExpiresAt <= DateTime.UtcNow)
            .ExecuteDeleteAsync(cancellationToken);
    }

    private static async Task RevokeActiveAsync(AppDbContext db, string userId, CancellationToken cancellationToken)
    {
        await db.RefreshTokens
            .Where(token => token.UserId == userId && token.RevokedAt == null)
            .ExecuteUpdateAsync(
                updates => updates.SetProperty(token => token.RevokedAt, DateTime.UtcNow),
                cancellationToken);
    }
}
