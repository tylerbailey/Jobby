using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Jobby.Models.Entities
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
