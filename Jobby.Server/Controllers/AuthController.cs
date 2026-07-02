using Jobby.Server.Constants;
using Jobby.Server.Entities;
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
public class AuthController(UserManager<ApplicationUser> users, IConfiguration config) : ControllerBase
{
    private readonly UserManager<ApplicationUser> _users = users;
    private readonly IConfiguration _config = config;

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

        return Ok(await CreateAuthResponseAsync(user));
    }

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

    private async Task<AuthResponse> CreateAuthResponseAsync(ApplicationUser user)
    {
        var roles = await _users.GetRolesAsync(user);
        var token = await CreateTokenAsync(user, roles);

        return new AuthResponse(token, user.Id, user.Email!, user.DisplayName, roles);
    }

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
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public record RegisterRequest(string Email, string Password, string? DisplayName);
public record LoginRequest(string Email, string Password);
public record AuthResponse(string Token, string Id, string Email, string? DisplayName, IList<string> Roles);
