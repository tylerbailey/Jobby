using System.ComponentModel.DataAnnotations.Schema;

namespace Jobby.Server.Entities
{
    public class JobApp : BaseModel, IEntity
    {
        [Column(TypeName = "varchar(450)")]
        public string UserId { get; set; } = string.Empty;

        [Column(TypeName = "varchar(64)")]
        public string Company { get; set; } = string.Empty;

        [Column(TypeName = "varchar(32)")]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "varchar(256)")]
        public string? JobPostingUrl { get; set; }

        [Column(TypeName = "varchar(256)")]
        public string? Address { get; set; }

        public int? Salary { get; set; }

        [ForeignKey("AppStage")]
        public int StageId { get; set; }

        [ForeignKey("LocationType")]
        public int LocationTypeId { get; set; }

        [Column(TypeName = "varchar(1024)")]
        public string? Notes { get; set; }

        [Column(TypeName = "varchar(256)")]
        public string? ContactName { get; set; }

        public DateTime? Applied { get; set; }

        public bool IsRejected { get; set; }

        public bool IsAccepted { get; set; }

        public  AppStage? AppStage { get; set; }

        public LocationType? LocationType { get; set; }

        public ICollection<JobHistory> JobHistory { get; set; } = [];

        public ICollection<JobEvent> JobEvents { get; set; } = [];       
    }
}
