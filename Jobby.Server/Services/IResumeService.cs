using Jobby.Server.Domain;

namespace Jobby.Server.Services
{
    public interface IResumeService
    {
        Task<ResumeAnalysisResponse> RateResumeAsync(IFormFile file);
    }
}