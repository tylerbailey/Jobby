using Jobby.Models.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Jobby.Infrastructure.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<ApplicationUser>(options)
    {
        public DbSet<Job> Jobs { get; set; }
        public DbSet<JobStage> JobStages { get; set; }
        public DbSet<LocationType> LocationTypes { get; set; }
        public DbSet<JobHistory> JobHistories { get; set; }
        public DbSet<CalendarEvent> CalendarEvents { get; set; }
        public DbSet<Recruiter> Recruiters { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<RefreshToken>(entity =>
            {
                entity.HasIndex(token => token.TokenHash).IsUnique();
                entity.HasOne<ApplicationUser>()
                    .WithMany()
                    .HasForeignKey(token => token.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }

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
