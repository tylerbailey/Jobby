using Jobby.Models.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Jobby.Infrastructure.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<ApplicationUser>(options)
    {
        public DbSet<JobApp> JobApps { get; set; }
        public DbSet<AppStage> AppStages { get; set; }
        public DbSet<LocationType> LocationTypes { get; set; }
        public DbSet<JobHistory> JobHistories { get; set; }
        public DbSet<CalendarEvent> CalendarEvents { get; set; }
        public DbSet<Recruiter> Recruiters { get; set; }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var now = DateTime.UtcNow;

            foreach (var entry in ChangeTracker.Entries<BaseModel>())
            {
                if (entry.State == EntityState.Added)
                {
                    if (entry.Entity.Created == default || entry.Entity.Created.Year < 2000)
                        entry.Entity.Created = now;

                    entry.Entity.Modified = now;
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Entity.Modified = now;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
