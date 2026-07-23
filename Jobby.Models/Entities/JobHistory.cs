using System.ComponentModel.DataAnnotations.Schema;

namespace Jobby.Models.Entities
{
    public class JobHistory : BaseModel, IEntity
    {
        [ForeignKey("Job")]
        public int JobId { get; set; }

        [Column(TypeName = "varchar(128)")]
        public string Color { get; set; } = string.Empty;
        
        [Column(TypeName = "varchar(256)")]
        public string EventTitle { get; set; } = string.Empty;

        [Column(TypeName = "varchar(512)")]
        public string EventDescription { get; set; } = string.Empty;

        public Job? Job { get; set; }

    }
}
