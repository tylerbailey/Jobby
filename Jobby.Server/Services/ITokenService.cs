using Jobby.Models.Entities;

namespace Jobby.Server.Services
{
    public interface ITokenService
    {
        string GenerateToken(ApplicationUser user, IList<string> roles);
    }
}