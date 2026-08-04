using Jobby.Server.Constants;
using Jobby.Models.Dto;
using Jobby.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Jobby.Server.Controllers;

[Authorize(Roles = Roles.Admin)]
[ApiController]
[Route("api/admin")]
public class AdminController(IAdminUserService adminUserService) : ControllerBase
{
    private readonly IAdminUserService _adminUserService = adminUserService;

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _adminUserService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpGet("users/{userId}")]
    public async Task<IActionResult> GetUser(string userId)
    {
        var user = await _adminUserService.GetUserAsync(userId);
        return user is null ? NotFound() : Ok(user);
    }

    [HttpGet("roles")]
    public async Task<IActionResult> GetAllRoles()
    {
        var roles = await _adminUserService.GetAllRolesAsync();
        return Ok(roles);
    }

    [HttpPut("users/{userId}")]
    public async Task<IActionResult> UpdateUser(string userId, UpdateUserAdminRequest request)
    {
        var actingUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        var (succeeded, error) = await _adminUserService.UpdateUserAsync(userId, request, actingUserId);

        if (!succeeded)
            return BadRequest(new { message = error });

        var user = await _adminUserService.GetUserAsync(userId);
        return Ok(user);
    }

    [HttpPut("users/{userId}/roles")]
    public async Task<IActionResult> UpdateUserRoles(string userId, UpdateUserRolesRequest request)
    {
        var actingUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        var (succeeded, error) = await _adminUserService.UpdateUserRolesAsync(userId, request.Roles, actingUserId);

        if (!succeeded)
            return BadRequest(new { message = error });

        var user = await _adminUserService.GetUserAsync(userId);
        return Ok(user);
    }

    [HttpDelete("users/{userId}")]
    public async Task<IActionResult> DeleteUser(string userId)
    {
        var actingUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        var (succeeded, error) = await _adminUserService.DeleteUserAsync(userId, actingUserId);

        if (!succeeded)
            return BadRequest(new { message = error });

        return Ok();
    }
}
