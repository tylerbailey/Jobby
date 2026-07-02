using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jobby.Server.Entities
{
    public class Recruiter : BaseModel, IEntity
    {
        public string UserId { get; set; } = string.Empty;

        [Column(TypeName = "varchar(64)")]
        public string Name { get; set; } = string.Empty;

        [Column(TypeName = "varchar(64)")]
        public string Agency { get; set; } = string.Empty;

        [Column(TypeName ="varchar(64)")]
        public string Email {  get; set; } = string.Empty;

        [Column(TypeName = "varchar(12)")]
        public string PhoneNumber { get; set; } = string.Empty;

        [Column(TypeName = "varchar(1024)")]
        public string Notes { get;set;  }  = string.Empty;

        public DateTime? LastContact { get; set; }

        public DateTime? NextContact { get; set; }

        public ICollection<JobApp> Applications { get; set; } = [];
    }
}
