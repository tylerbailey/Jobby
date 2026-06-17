using Jobby.Server.Domain;
using Jobby.Server.Entities;

namespace Jobby.Server.Services
{
    public interface IRecruiterService
    {
        Task CreateRecruitor(RecruiterModel recruiterModel, string userId);
        Task DeleteRecruitor(int recruiterId, string userId);
        Task<RecruiterModel> GetRecruitor(int recruiterId, string userId);
        Task<List<Recruiter>> GetRecruitors(string userId);
        Task UpdateRecruitor(RecruiterModel recruiterModel);
    }
}