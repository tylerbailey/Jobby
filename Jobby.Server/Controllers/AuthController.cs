using Jobby.Server.Constants;
using Jobby.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Jobby.Server.Controllers;

[Authorize]
[ApiController]
[Route("api/auth")]
public class AuthController(
    UserManager<ApplicationUser> users,
    IConfiguration config,
    IWebHostEnvironment env) : ControllerBase
{
    private const string TokenCookieName = "token";
    private static readonly TimeSpan TokenLifetime = TimeSpan.FromHours(1);

    private readonly UserManager<ApplicationUser> _users = users;
    private readonly IConfiguration _config = config;
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
        var token = await CreateTokenAsync(user, roles);
        var expires = DateTimeOffset.UtcNow.Add(TokenLifetime);

        Response.Cookies.Append(TokenCookieName, token, CreateTokenCookieOptions(expires));

        return Ok(new
        {
            id = user.Id,
            email = user.Email,
            displayName = user.DisplayName,
            roles
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
            roles
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

    /// <summary>Creates a signed JWT for the given user and roles.</summary>
    private async Task<string> CreateTokenAsync(ApplicationUser user, IList<string>? roles = null)
    {
        var jwt = _config.GetSection("Jwt");
        roles ??= await _users.GetRolesAsync(user);
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new (JwtRegisteredClaimNames.Email, user.Email!),
            new (ClaimTypes.NameIdentifier, user.Id),
            new (ClaimTypes.Name, user.UserName!),
        };

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwt["Issuer"],
            audience: jwt["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.Add(TokenLifetime),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public record RegisterRequest(string Email, string Password, string? DisplayName);
public record LoginRequest(string Email, string Password);
