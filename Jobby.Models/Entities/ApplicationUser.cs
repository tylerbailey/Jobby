using Microsoft.AspNet.Identity.EntityFramework;

namespace Jobby.Models.Entities
{

    public class ApplicationUser : IdentityUser
    {
        public string? DisplayName { get; set; }
    }
}
