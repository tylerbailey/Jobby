using Jobby.Models.Dto;

namespace Jobby.Server.Services
{
    public interface IResumeService
    {
        /// <summary>Extracts text from an uploaded resume and uses the AI service to produce an ATS-style analysis report.</summary>
        Task<ResumeAnalysisResponse> RateResumeAsync(IFormFile file);
    }
}