namespace Jobby.Server.Domain
{
    public class ResumeChange
    {
        public int Id { get; set; }
        public string OriginalText { get; set; } = string.Empty;
        public string NewText { get; set; } = string.Empty;
    }
}
