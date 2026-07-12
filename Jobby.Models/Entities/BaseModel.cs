using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Jobby.Server.Entities
{
    public class BaseModel
    {
        [Key]
        public int Id { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Modified { get; set; }
        public bool Disabled { get; set; }
    }
}
