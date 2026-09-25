namespace Jobby.Server
{
    public class JwtOptions
    {
        public string Issuer { get; set; } = string.Empty;
        public string Audience { get; set; } = string.Empty;
        public string Key { get; set; } = string.Empty;
        public int ExpiryInMinutes { get; set; }

        /// <summary>How long a refresh token stays valid after login, in minutes.</summary>
        public int RefreshExpiryInMinutes { get; set; }
    }
}
