using System.ComponentModel.DataAnnotations.Schema;

namespace Jobby.Server.Entities
{
    public class JobEvent: BaseModel, IEntity
    {
        [ForeignKey("JobApp")]
        public int AppId { get; set; }
        public string EventTitle { get; set; } = string.Empty;
        public string EventDescription { get; set; } = string.Empty;
        public DateTime EventDate { get; set; }

        public virtual JobApp? JobApp { get; set; }

    }
}
