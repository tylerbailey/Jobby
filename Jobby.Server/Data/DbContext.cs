using Jobby.Server.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Jobby.Server.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<ApplicationUser>(options)
    {
        public DbSet<JobApp> JobApps { get; set; }
        public DbSet<AppStage> AppStages { get; set; }
        public DbSet<LocationType> LocationTypes { get; set; }
    }
}
