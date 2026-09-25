using System.ComponentModel.DataAnnotations.Schema;

namespace Jobby.Models.Entities
{
    public class RefreshToken
    {
        public int Id { get; set; }

        [Column(TypeName = "varchar(450)")]
        public string UserId { get; set; } = string.Empty;

        [Column(TypeName = "varchar(128)")]
        public string TokenHash { get; set; } = string.Empty;

        public DateTime ExpiresAt { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? RevokedAt { get; set; }
    }
}
