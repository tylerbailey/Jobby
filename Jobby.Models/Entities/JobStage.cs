using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Jobby.Models.Entities
{
    public class JobStage : BaseModel, IEntity
    {
        [Column(TypeName = "varchar(450)")]
        public string UserId { get; set; } = string.Empty;

        [Column(TypeName = "varchar(128)")]
        public string Name { get; set; } = string.Empty;

        public int Order { get; set; }

        [Column(TypeName = "varchar(128)")]
        public string Color { get; set; } = string.Empty;

        public ICollection<Job> Jobs { get; set; } = [];
    }
}
