using Jobby.Server.Data;
using Jobby.Server.Domain;
using Jobby.Server.Entities;
using Microsoft.EntityFrameworkCore;

namespace Jobby.Server.Services
{
    public class RecruiterService(IDbContextFactory<AppDbContext> dbContextFactory) : ServiceBase(dbContextFactory), IRecruiterService
    {
        public async Task CreateRecruitor(RecruiterModel recruiterModel, string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var recruiter = new Recruiter
            {
                UserId = userId,
                Name = recruiterModel.Name,
                Agency = recruiterModel.Agency,
                PhoneNumber = recruiterModel.PhoneNumber,
            };
            await db.Recruiters.AddAsync(recruiter);
            await db.SaveChangesAsync();
        }

        public async Task<List<Recruiter>> GetRecruitors(string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var recruiters = await db.Recruiters.Where(r => r.UserId == userId && !r.Disabled).Select(r =>
            new Recruiter
            {
                Id = r.Id,
                Agency = r.Agency,
                Name = r.Name,
                PhoneNumber = r.PhoneNumber,
                Applications = r.Applications,
                LastContact = r.LastContact,
                NextContact = r.NextContact,
                Email = r.Email,
                Notes = r.Notes,
            }).ToListAsync() ?? [];
            return recruiters;
        }

        public async Task<RecruiterModel> GetRecruitor(int recruiterId, string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var recruiter = await db.Recruiters.Where(r => r.Id == recruiterId && r.UserId == userId && !r.Disabled).Select(r =>
            new RecruiterModel
            {
                Agency = r.Agency,
                Name = r.Name,
                PhoneNumber = r.PhoneNumber,
                LastContact = r.LastContact,
                NextContact = r.NextContact,
                Email = r.Email,
                Notes = r.Notes,
                ApplicationIds = r.Applications.Select(a => a.Id).ToList(),
            }).FirstOrDefaultAsync() ?? new RecruiterModel();
            return recruiter;
        }

        public async Task UpdateRecruitor(RecruiterModel recruiterModel)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var recruiter = await db.Recruiters.Where(r => r.Id == recruiterModel.Id && !r.Disabled).FirstOrDefaultAsync();
            if (recruiter != null)
            {
                recruiter.Agency = recruiterModel.Agency;
                recruiter.Name = recruiterModel.Name;
                recruiter.PhoneNumber = recruiterModel.PhoneNumber;
                recruiter.LastContact = recruiterModel.LastContact;
                recruiter.NextContact = recruiterModel.NextContact;
                recruiter.Email = recruiterModel.Email;
                recruiter.Notes = recruiterModel.Notes;
                await db.SaveChangesAsync();
            }
        }

        public async Task DeleteRecruitor(int recruiterId, string userId)
        {
            await using var db = await _dbContextFactory.CreateDbContextAsync();
            var recruiter = await db.Recruiters.Where(r => r.Id == recruiterId && r.UserId == userId && !r.Disabled).FirstOrDefaultAsync();
            if (recruiter != null)
            {
                db.Recruiters.Remove(recruiter);
                await db.SaveChangesAsync();
            }
        }
    }
}
