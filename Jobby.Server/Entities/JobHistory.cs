using System.ComponentModel.DataAnnotations.Schema;

namespace Jobby.Server.Entities
{
    public class JobHistory : BaseModel, IEntity
    {
        [ForeignKey("JobApp")]
        public int AppId { get; set; }

        public string Color { get; set; }

        public string EventTitle { get; set; }

        public string EventDescription { get; set; }

        public virtual JobApp JobApp { get; set; }

    }
}
