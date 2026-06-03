using System.ComponentModel.DataAnnotations.Schema;

namespace Jobby.Server.Entities
{
    public class JobApp : BaseModel, IEntity
    {
        [Column(TypeName = "varchar(450)")]
        public string UserId { get; set; }

        [Column(TypeName = "varchar(64)")]
        public string Company { get; set; }

        [Column(TypeName = "varchar(32)")]
        public string Title { get; set; }

        [Column(TypeName = "varchar(256)")]
        public string? JobPostingUrl { get; set; }

        [Column(TypeName = "varchar(256)")]
        public string? Address { get; set; }

        public int? Salary { get; set; }

        [ForeignKey("AppStage")]
        public int StageId { get; set; }

        [ForeignKey("LocationType")]
        public int LocationTypeId { get; set; }

        public DateTime? Applied { get; set; }

        public DateTime? Upcoming { get; set; }

        [Column(TypeName = "varchar(16)")]
        public string? UpcomingType { get; set; }

        [Column(TypeName = "varchar(1024)")]
        public string? Notes { get; set; }

        public virtual AppStage AppStage { get; set; }

        public virtual LocationType LocationType { get; set; }
    }
}
