using Jobby.Server.Dto;

namespace Jobby.Server.Services;

public interface IAdminUserService
{
    Task<IList<UserAdminModel>> GetAllUsersAsync();
    Task<UserAdminModel?> GetUserAsync(string userId);
    Task<IList<string>> GetAllRolesAsync();
    Task<(bool Succeeded, string? Error)> UpdateUserAsync(string userId, UpdateUserAdminRequest request, string actingUserId);
    Task<(bool Succeeded, string? Error)> UpdateUserRolesAsync(string userId, IList<string> roles, string actingUserId);
    Task<(bool Succeeded, string? Error)> DeleteUserAsync(string userId, string actingUserId);
}
