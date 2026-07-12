using System.ComponentModel.DataAnnotations.Schema;

namespace Jobby.Models.Entities
{
    public class JobHistory : BaseModel, IEntity
    {
        [ForeignKey("JobApp")]
        public int AppId { get; set; }

        [Column(TypeName = "varchar(128)")]
        public string Color { get; set; } = string.Empty;
        
        [Column(TypeName = "varchar(256)")]
        public string EventTitle { get; set; } = string.Empty;

        [Column(TypeName = "varchar(512)")]
        public string EventDescription { get; set; } = string.Empty;

        public JobApp? JobApp { get; set; }

    }
}
