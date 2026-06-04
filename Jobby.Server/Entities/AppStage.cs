using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Jobby.Server.Entities
{
    public class AppStage : BaseModel, IEntity
    {
        [Column(TypeName = "varchar(450)")]
        public string UserId { get; set; }

        [Column(TypeName = "varchar(32)")]
        public string Name { get; set; }

        public int Order { get; set; }

        [Column(TypeName = "varchar(64)")]
        public string Color { get; set; }

        public virtual List<JobApp> JobApps { get; set; }
    }
}
