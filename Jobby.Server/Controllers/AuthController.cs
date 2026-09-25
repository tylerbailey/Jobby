using Jobby.Models.Entities;
using Jobby.Server.Constants;
using Jobby.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace Jobby.Server.Controllers;

[Authorize]
[ApiController]
[Route("api/auth")]
public class AuthController(
    UserManager<ApplicationUser> users,
    ITokenService tokenService,
    IRefreshTokenService refreshTokens,
    IOptions<JwtOptions> jwtOptions,
    IWebHostEnvironment env) : ControllerBase
{
    public const string SessionExpiredMessage = "Session has expired. Please log in.";

    private const string TokenCookieName = "token";
    private const string RefreshCookieName = "refreshToken";

    private readonly UserManager<ApplicationUser> _users = users;
    private readonly ITokenService _tokenService = tokenService;
    private readonly IRefreshTokenService _refreshTokens = refreshTokens;
    private readonly JwtOptions _jwtOptions = jwtOptions.Value;
    private readonly IWebHostEnvironment _env = env;

    /// <summary>Registers a new user account pending admin approval.</summary>
    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
            return BadRequest(new { message = "Email is required." });

        if (string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Password is required." });

        if (string.IsNullOrWhiteSpace(request.DisplayName))
            return BadRequest(new { message = "Display name is required." });

        var user = new ApplicationUser
        {
            UserName = request.Email.Trim(),
            Email = request.Email.Trim(),
            DisplayName = request.DisplayName.Trim()
        };

        var result = await _users.CreateAsync(user, request.Password);

        if (!result.Succeeded)
            return BadRequest(new
            {
                message = "Could not create account.",
                errors = result.Errors.Select(e => e.Description).ToArray()
            });

        var roleResult = await _users.AddToRoleAsync(user, Roles.User);
        if (!roleResult.Succeeded)
            return BadRequest(new
            {
                message = "Account was created but could not assign the default role.",
                errors = roleResult.Errors.Select(e => e.Description).ToArray()
            });

        return Ok(new { message = "Account created. Your account is awaiting approval." });
    }

    /// <summary>Authenticates a user and sets the auth token cookie.</summary>
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Email and password are required." });

        var user = await _users.FindByEmailAsync(request.Email.Trim());

        if (user is null || !await _users.CheckPasswordAsync(user, request.Password))
            return Unauthorized(new { message = "Invalid email or password." });

        if (!user.IsApproved)
            return StatusCode(StatusCodes.Status403Forbidden, new
            {
                message = "Your account is pending approval."
            });

        if (Request.Cookies.TryGetValue(RefreshCookieName, out var existingRefresh))
            await _refreshTokens.RevokeAsync(existingRefresh);

        var roles = await _users.GetRolesAsync(user);
        await IssueAuthCookiesAsync(user, roles);

        return Ok(new
        {
            id = user.Id,
            email = user.Email,
            displayName = user.DisplayName,
            roles
        });
    }

    /// <summary>Issues a new access token when the refresh token is still valid.</summary>
    [AllowAnonymous]
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        if (!Request.Cookies.TryGetValue(RefreshCookieName, out var refreshToken) || string.IsNullOrWhiteSpace(refreshToken))
            return SessionExpired();

        var rotation = await _refreshTokens.RotateAsync(refreshToken);
        if (!rotation.Succeeded || rotation.UserId is null || rotation.Token is null || rotation.ExpiresAt is null)
            return SessionExpired();

        var user = await _users.FindByIdAsync(rotation.UserId);
        if (user is null || !user.IsApproved)
        {
            await _refreshTokens.RevokeAsync(rotation.Token);
            return SessionExpired();
        }

        var roles = await _users.GetRolesAsync(user);
        var accessToken = _tokenService.GenerateToken(user, roles);
        AppendAuthCookies(accessToken, rotation.Token, rotation.ExpiresAt.Value);

        return Ok(new
        {
            id = user.Id,
            email = user.Email,
            displayName = user.DisplayName,
            roles
        });
    }

    /// <summary>Logs the current user out by revoking the refresh token and clearing auth cookies.</summary>
    [AllowAnonymous]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        if (Request.Cookies.TryGetValue(RefreshCookieName, out var refreshToken))
            await _refreshTokens.RevokeAsync(refreshToken);

        ClearAuthCookies();
        return Ok();
    }

    /// <summary>Gets the currently authenticated user's profile information.</summary>
    [HttpGet("user")]
    public async Task<IActionResult> GetUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return Unauthorized();

        var user = await _users.FindByIdAsync(userId);
        if (user is null)
            return NotFound();

        var roles = await _users.GetRolesAsync(user);

        return Ok(new
        {
            id = user.Id,
            email = user.Email,
            displayName = user.DisplayName,
            roles
        });
    }

    /// <summary>Creates an access token and refresh token, then stores both in cookies.</summary>
    private async Task IssueAuthCookiesAsync(ApplicationUser user, IList<string> roles)
    {
        var refreshToken = await _refreshTokens.IssueAsync(user.Id);
        var accessToken = _tokenService.GenerateToken(user, roles);
        AppendAuthCookies(accessToken, refreshToken.Token, refreshToken.ExpiresAt);
    }

    /// <summary>Writes the access and refresh token cookies.</summary>
    private void AppendAuthCookies(string accessToken, string refreshToken, DateTimeOffset refreshExpires)
    {
        var accessExpires = DateTimeOffset.UtcNow.AddMinutes(_jwtOptions.ExpiryInMinutes);
        Response.Cookies.Append(TokenCookieName, accessToken, CreateTokenCookieOptions(accessExpires));
        Response.Cookies.Append(RefreshCookieName, refreshToken, CreateTokenCookieOptions(refreshExpires));
    }

    /// <summary>Clears both auth cookies and returns the session-expired response.</summary>
    private IActionResult SessionExpired()
    {
        ClearAuthCookies();
        return Unauthorized(new { message = SessionExpiredMessage, code = "session_expired" });
    }

    /// <summary>Removes the access and refresh token cookies.</summary>
    private void ClearAuthCookies()
    {
        var options = CreateTokenCookieOptions(DateTimeOffset.UnixEpoch);
        Response.Cookies.Delete(TokenCookieName, options);
        Response.Cookies.Delete(RefreshCookieName, options);
    }

    /// <summary>Builds the cookie options used for auth cookies.</summary>
    private CookieOptions CreateTokenCookieOptions(DateTimeOffset expires) => new()
    {
        HttpOnly = true,
        Secure = true,
        SameSite = _env.IsDevelopment() ? SameSiteMode.Lax : SameSiteMode.None,
        Path = "/",
        Expires = expires
    };
}

public record RegisterRequest(string Email, string Password, string? DisplayName);
public record LoginRequest(string Email, string Password);
