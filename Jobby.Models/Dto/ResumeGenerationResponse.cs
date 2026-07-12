namespace Jobby.Models.Dto
{
    public class ResumeGenerationResponse
    {
        public string DocumentBase64 { get; set; } = string.Empty;
        public List<ResumeChange> Changes { get; set; } = [];
    }
}
