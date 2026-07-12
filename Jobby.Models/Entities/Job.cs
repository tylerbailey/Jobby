using System.ComponentModel.DataAnnotations.Schema;

namespace Jobby.Models.Entities
{
    public class Job : BaseModel, IEntity
    {
        [Column(TypeName = "varchar(450)")]
        public string CreatorId { get; set; } = string.Empty;

        [Column(TypeName = "varchar(256)")]
        public string Company { get; set; } = string.Empty;

        [Column(TypeName = "varchar(256)")]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "varchar(1024)")]
        public string? JobPostingUrl { get; set; }

        [Column(TypeName = "varchar(512)")]
        public string? Address { get; set; }

        [Column(TypeName = "varchar(256)")]
        public string SalaryRange { get; set; } = string.Empty;

        [ForeignKey("AppStage")]
        public int StageId { get; set; }

        [ForeignKey("LocationType")]
        public int LocationTypeId { get; set; }
    }
}
