namespace Jobby.Models.Domain
{
    public class JobApplication
    {
        public Guid Id { get; set; }

        public string UserId { get; set; } = string.Empty;

        public string CompanyName { get; set; } = string.Empty;
        public string JobTitle { get; set; } = string.Empty;
        public string? JobPostingUrl { get; set; }

        public string Stage { get; set; } = "Wishlist";

        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? AppliedAt { get; set; }
    }
}
