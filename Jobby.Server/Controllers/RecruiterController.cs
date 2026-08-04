using Jobby.Models.Dto;
using Jobby.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Jobby.Server.Controllers;

[Authorize]
[ApiController]
[Route("api/recruiter")]
public class RecruiterController(IRecruiterService recruiterService) : Controller
{
    private readonly IRecruiterService _recruiterService = recruiterService;

    /// <summary>Creates a new recruiter for the current user.</summary>
    [HttpPost("new")]
    public async Task<IActionResult> CreateRecruiter(RecruiterModel recruiter)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        await _recruiterService.CreateRecruiterAsync(recruiter, userId);
        return Ok();
    }

    /// <summary>Gets a single recruiter belonging to the current user.</summary>
    [HttpGet("{recruiterId}")]
    public async Task<IActionResult> GetRecruiter(int recruiterId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        var recruiter = await _recruiterService.GetRecruiterAsync(recruiterId, userId);
        return Ok(recruiter);
    }

    /// <summary>Gets all recruiters belonging to the current user.</summary>
    [HttpGet("all")]
    public async Task<IActionResult> GetRecruiters()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        var recruiters = await _recruiterService.GetRecruitersAsync(userId);
        return Ok(recruiters);
    }

    /// <summary>Updates an existing recruiter for the current user.</summary>
    [HttpPost("update")]
    public async Task<IActionResult> UpdateRecruiter(RecruiterModel recruiter)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        await _recruiterService.UpdateRecruiterAsync(recruiter, userId);
        return Ok();
    }

    /// <summary>Deletes a recruiter belonging to the current user.</summary>
    [HttpDelete("{recruiterId}")]
    public async Task<IActionResult> DeleteRecruiter(int recruiterId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        await _recruiterService.DeleteRecruiterAsync(recruiterId, userId);
        return Ok();
    }
}
