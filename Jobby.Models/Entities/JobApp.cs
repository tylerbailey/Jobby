using System.ComponentModel.DataAnnotations.Schema;

namespace Jobby.Server.Entities
{
    public class JobApp : BaseModel, IEntity
    {
        [Column(TypeName = "varchar(450)")]
        public string UserId { get; set; } = string.Empty;

        [Column(TypeName = "varchar(256)")]
        public string Company { get; set; } = string.Empty;

        [Column(TypeName = "varchar(256)")]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "varchar(2046)")]
        public string? Summary { get; set; }

        [Column(TypeName = "varchar(1024)")]
        public string? JobPostingUrl { get; set; }

        [Column(TypeName = "varchar(512)")]
        public string? Address { get; set; }

        public int? Salary { get; set; }

        [ForeignKey("AppStage")]
        public int StageId { get; set; }

        [ForeignKey("LocationType")]
        public int LocationTypeId { get; set; }

        [Column(TypeName = "varchar(2046)")]
        public string? Notes { get; set; }

        [Column(TypeName = "varchar(256)")]
        public string? ContactName { get; set; }

        public DateTime? Applied { get; set; }

        public int Status { get; set; }

        public bool IsArchived { get; set; }

        [ForeignKey("Recruitor")]
        public int? RecruitorId { get; set; }

        public  AppStage? AppStage { get; set; }

        public LocationType? LocationType { get; set; }

        public Recruiter? Recruitor { get; set; }
            
        public ICollection<JobHistory> JobHistory { get; set; } = [];

        public ICollection<JobEvent> JobEvents { get; set; } = [];       
    }
}
