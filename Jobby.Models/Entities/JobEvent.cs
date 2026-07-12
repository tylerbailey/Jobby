using System.ComponentModel.DataAnnotations.Schema;

namespace Jobby.Server.Entities
{
    public class JobEvent: BaseModel, IEntity
    {
        [ForeignKey("JobApp")]
        public int? AppId { get; set; }

        [ForeignKey("Recruiter")]
        public int? RecruitId { get; set; }

        [Column(TypeName = "varchar(256)")]
        public string EventTitle { get; set; } = string.Empty;

        [Column(TypeName = "varchar(1024)")]
        public string EventDescription { get; set; } = string.Empty;

        public DateTime EventDate { get; set; }

        public int NotificationMinutesBefore { get; set; }

        public Boolean SendNotification { get; set; } = false;

        public Boolean NotificationSent { get; set; } = false;

        public virtual JobApp? JobApp { get; set; }

        public virtual Recruiter? Recruiter { get; set; }
    }
}
