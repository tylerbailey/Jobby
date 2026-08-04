using Jobby.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Jobby.Server.Controllers;

[Authorize]
[ApiController]
[Route("api/profile")]
public class ProfileController(IProfileService profileService) : ControllerBase
{
    private readonly IProfileService _profileService = profileService;

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return Unauthorized();

        var stats = await _profileService.GetMonthlyStatsAsync(userId);
        return Ok(stats);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProfile(UpdateProfileRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return Unauthorized();

        var error = await _profileService.UpdateDisplayNameAsync(userId, request.DisplayName ?? string.Empty);
        if (error is not null)
            return BadRequest(new { message = error });

        return Ok(new { displayName = request.DisplayName?.Trim() });
    }
}

public record UpdateProfileRequest(string? DisplayName);
