using Jobby.Server.Constants;
using Jobby.Server.Dto;
using Jobby.Server.Entities;
using Microsoft.AspNetCore.Identity;

namespace Jobby.Server.Services;

public class AdminUserService(
    UserManager<ApplicationUser> userManager,
    RoleManager<IdentityRole> roleManager) : IAdminUserService
{
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly RoleManager<IdentityRole> _roleManager = roleManager;

    public async Task<IList<UserAdminModel>> GetAllUsersAsync()
    {
        var users = _userManager.Users.OrderBy(u => u.Email).ToList();
        var models = new List<UserAdminModel>();

        foreach (var user in users)
            models.Add(await MapUserAsync(user));

        return models;
    }

    public async Task<UserAdminModel?> GetUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        return user is null ? null : await MapUserAsync(user);
    }

    public Task<IList<string>> GetAllRolesAsync()
    {
        var roles = _roleManager.Roles
            .OrderBy(r => r.Name)
            .Select(r => r.Name!)
            .ToList();

        return Task.FromResult<IList<string>>(roles);
    }

    public async Task<(bool Succeeded, string? Error)> UpdateUserAsync(
        string userId,
        UpdateUserAdminRequest request,
        string actingUserId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
            return (false, "User not found.");

        if (!string.IsNullOrWhiteSpace(request.Email) && request.Email != user.Email)
        {
            var existing = await _userManager.FindByEmailAsync(request.Email);
            if (existing is not null && existing.Id != userId)
                return (false, "Email is already in use.");

            var emailResult = await _userManager.SetEmailAsync(user, request.Email);
            if (!emailResult.Succeeded)
                return (false, string.Join(", ", emailResult.Errors.Select(e => e.Description)));

            var userNameResult = await _userManager.SetUserNameAsync(user, request.Email);
            if (!userNameResult.Succeeded)
                return (false, string.Join(", ", userNameResult.Errors.Select(e => e.Description)));
        }

        if (request.DisplayName is not null)
            user.DisplayName = request.DisplayName;

        if (request.IsApproved.HasValue)
            user.IsApproved = request.IsApproved.Value;

        if (request.EmailConfirmed.HasValue)
            user.EmailConfirmed = request.EmailConfirmed.Value;

        if (request.LockoutEnabled.HasValue)
            user.LockoutEnabled = request.LockoutEnabled.Value;

        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
            return (false, string.Join(", ", updateResult.Errors.Select(e => e.Description)));

        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            var hasPassword = await _userManager.HasPasswordAsync(user);
            IdentityResult passwordResult;

            if (hasPassword)
            {
                await _userManager.RemovePasswordAsync(user);
                passwordResult = await _userManager.AddPasswordAsync(user, request.Password);
            }
            else
            {
                passwordResult = await _userManager.AddPasswordAsync(user, request.Password);
            }

            if (!passwordResult.Succeeded)
                return (false, string.Join(", ", passwordResult.Errors.Select(e => e.Description)));
        }

        return (true, null);
    }

    public async Task<(bool Succeeded, string? Error)> UpdateUserRolesAsync(
        string userId,
        IList<string> roles,
        string actingUserId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
            return (false, "User not found.");

        var requestedRoles = roles
            .Where(r => !string.IsNullOrWhiteSpace(r))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        foreach (var role in requestedRoles)
        {
            if (!await _roleManager.RoleExistsAsync(role))
                return (false, $"Role '{role}' does not exist.");
        }

        if (userId == actingUserId && !requestedRoles.Contains(Roles.Admin, StringComparer.OrdinalIgnoreCase))
            return (false, "You cannot remove the Admin role from your own account.");

        var currentRoles = await _userManager.GetRolesAsync(user);

        var toRemove = currentRoles
            .Where(r => !requestedRoles.Contains(r, StringComparer.OrdinalIgnoreCase))
            .ToList();
        var toAdd = requestedRoles
            .Where(r => !currentRoles.Contains(r, StringComparer.OrdinalIgnoreCase))
            .ToList();

        if (toRemove.Count > 0)
        {
            var removeResult = await _userManager.RemoveFromRolesAsync(user, toRemove);
            if (!removeResult.Succeeded)
                return (false, string.Join(", ", removeResult.Errors.Select(e => e.Description)));
        }

        if (toAdd.Count > 0)
        {
            var addResult = await _userManager.AddToRolesAsync(user, toAdd);
            if (!addResult.Succeeded)
                return (false, string.Join(", ", addResult.Errors.Select(e => e.Description)));
        }

        return (true, null);
    }

    public async Task<(bool Succeeded, string? Error)> DeleteUserAsync(string userId, string actingUserId)
    {
        if (userId == actingUserId)
            return (false, "You cannot delete your own account.");

        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
            return (false, "User not found.");

        var result = await _userManager.DeleteAsync(user);
        return result.Succeeded
            ? (true, null)
            : (false, string.Join(", ", result.Errors.Select(e => e.Description)));
    }

    private async Task<UserAdminModel> MapUserAsync(ApplicationUser user)
    {
        var roles = await _userManager.GetRolesAsync(user);

        return new UserAdminModel
        {
            Id = user.Id,
            Email = user.Email ?? string.Empty,
            DisplayName = user.DisplayName,
            IsApproved = user.IsApproved,
            EmailConfirmed = user.EmailConfirmed,
            LockoutEnabled = user.LockoutEnabled,
            LockoutEnd = user.LockoutEnd,
            Roles = roles.ToList()
        };
    }
}
