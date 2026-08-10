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
public class AuthController(UserManager<ApplicationUser> users, ITokenService tokenService, IOptions<JwtOptions> jwtOptions, IWebHostEnvironment env) : ControllerBase
{
    private const string TokenCookieName = "token";

    private readonly UserManager<ApplicationUser> _users = users;
    private readonly ITokenService _tokenService = tokenService;
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

        var roles = await _users.GetRolesAsync(user);
        var token = _tokenService.GenerateToken(user, roles);
        var expires = DateTimeOffset.UtcNow.AddMinutes(_jwtOptions.ExpiryInMinutes);

        Response.Cookies.Append(TokenCookieName, token, CreateTokenCookieOptions(expires));

        return Ok(new
        {
            id = user.Id,
            email = user.Email,
            displayName = user.DisplayName,
            roles,
            expiresAt = expires
        });
    }

    /// <summary>Logs the current user out by clearing the auth token cookie.</summary>
    [AllowAnonymous]
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete(TokenCookieName, CreateTokenCookieOptions(DateTimeOffset.UtcNow));
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
            roles,
            expiresAt = GetTokenExpiresAt(User)
        });
    }

    /// <summary>Builds the cookie options used for the auth token cookie.</summary>
    private CookieOptions CreateTokenCookieOptions(DateTimeOffset expires) => new()
    {
        HttpOnly = true,
        Secure = true,
        SameSite = _env.IsDevelopment() ? SameSiteMode.Lax : SameSiteMode.None,
        Path = "/",
        Expires = expires
    };

    /// <summary>Reads the JWT exp claim as a UTC timestamp, if present.</summary>
    private static DateTimeOffset? GetTokenExpiresAt(ClaimsPrincipal principal)
    {
        var expValue = principal.FindFirst("exp")?.Value;
        if (expValue is null || !long.TryParse(expValue, out var seconds))
            return null;

        return DateTimeOffset.FromUnixTimeSeconds(seconds);
    }
}

public record RegisterRequest(string Email, string Password, string? DisplayName);
public record LoginRequest(string Email, string Password);
