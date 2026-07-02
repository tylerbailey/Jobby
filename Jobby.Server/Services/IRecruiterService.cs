using Jobby.Server.Domain;
using Jobby.Server.Entities;

namespace Jobby.Server.Services;

public interface IRecruiterService
{
    Task CreateRecruiterAsync(RecruiterModel recruiterModel, string userId);
    Task DeleteRecruiterAsync(int recruiterId, string userId);
    Task<RecruiterModel> GetRecruiterAsync(int recruiterId, string userId);
    Task<List<Recruiter>> GetRecruitersAsync(string userId);
    Task UpdateRecruiterAsync(RecruiterModel recruiterModel, string userId);
}
