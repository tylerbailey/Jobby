using Jobby.Models.Dto;

namespace Jobby.Server.Services;

public interface IAdminUserService
{
    /// <summary>Retrieves all users, ordered by email, mapped to admin view models.</summary>
    Task<IList<UserAdminModel>> GetAllUsersAsync();
    /// <summary>Retrieves a single user mapped to an admin view model, or null if not found.</summary>
    Task<UserAdminModel?> GetUserAsync(string userId);
    /// <summary>Retrieves the names of all available roles, ordered alphabetically.</summary>
    Task<IList<string>> GetAllRolesAsync();
    /// <summary>Updates a user's email, display name, approval, confirmation, lockout, and password settings.</summary>
    Task<(bool Succeeded, string? Error)> UpdateUserAsync(string userId, UpdateUserAdminRequest request, string actingUserId);
    /// <summary>Updates a user's assigned roles, preventing an admin from removing their own Admin role.</summary>
    Task<(bool Succeeded, string? Error)> UpdateUserRolesAsync(string userId, IList<string> roles, string actingUserId);
    /// <summary>Deletes a user account, preventing an admin from deleting their own account.</summary>
    Task<(bool Succeeded, string? Error)> DeleteUserAsync(string userId, string actingUserId);
}
