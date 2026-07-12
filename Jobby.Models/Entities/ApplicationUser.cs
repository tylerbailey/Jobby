using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jobby.Models.Entities
{

    public class ApplicationUser : IdentityUser
    {
        [Column(TypeName = "varchar(256)")]
        public string? DisplayName { get; set; }
        public bool IsApproved { get; set; } = false;
        public bool ReceiveEmailNotifications { get; set; } = false;
    }
}
