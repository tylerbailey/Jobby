using Jobby.Models.Dto;
using Jobby.Models.Entities;

namespace Jobby.Server.Services;

public interface IRecruiterService
{
    /// <summary>Creates a new recruiter record for the given user.</summary>
    Task CreateRecruiterAsync(RecruiterDto recruiterModel, string userId);
    /// <summary>Deletes a recruiter belonging to the given user.</summary>
    Task DeleteRecruiterAsync(int recruiterId, string userId);
    /// <summary>Retrieves a single active recruiter and their linked application ids for the given user.</summary>
    Task<RecruiterDto> GetRecruiterAsync(int recruiterId, string userId);
    /// <summary>Retrieves all active recruiters for the given user.</summary>
    Task<List<Recruiter>> GetRecruitersAsync(string userId);
    /// <summary>Updates the fields of an existing recruiter belonging to the given user.</summary>
    Task UpdateRecruiterAsync(RecruiterDto recruiterModel, string userId);
}
