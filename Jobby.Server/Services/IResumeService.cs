using Jobby.Models.Dto;

namespace Jobby.Server.Services
{
    public interface IResumeService
    {
        Task<ResumeAnalysisResponse> RateResumeAsync(IFormFile file);
    }
}