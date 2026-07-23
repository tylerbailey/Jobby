using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jobby.Models.Entities
{
    public class CalendarEvent: BaseModel, IEntity
    {
        [Required]
        [ForeignKey("User")]
        public string UserId { get; set; } = string.Empty;

        [ForeignKey("Job")]
        public int? JobId { get; set; }

        [ForeignKey("Recruiter")]
        public int? RecruiterId { get; set; }

        [Column(TypeName = "varchar(256)")]
        public string EventTitle { get; set; } = string.Empty;

        [Column(TypeName = "varchar(1024)")]
        public string EventDescription { get; set; } = string.Empty;

        public DateTime EventDate { get; set; }

        public virtual ApplicationUser? User { get; set; }

        public virtual Job? Job { get; set; }

        public virtual Recruiter? Recruiter { get; set; }
    }
}
