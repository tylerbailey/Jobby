using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Jobby.Server.Domain
{
    public class ResumeAnalysisResponse
    {
        [Description("Overall resume quality score from 0 to 100.")]
        [Range(0, 100)]
        public int OverallScore { get; set; }

        public RecommendationLevel Recommendation { get; set; }

        public List<ScoreBreakdown> Scores { get; set; } = [];

        public SummaryAnalysis Summary { get; set; } = new();

        public AtsFindings AtsFindings { get; set; } = new();

        public List<GrammarIssue> GrammarIssues { get; set; } = [];

        public List<SpellingIssue> SpellingIssues { get; set; } = [];

        public List<KeywordSuggestion> KeywordSuggestions { get; set; } = [];

        public SectionAnalysis SectionAnalysis { get; set; } = new();

        public List<BulletPointRecommendation> BulletPointRecommendations { get; set; } = [];

        public List<string> MissingSections { get; set; } = [];

        public ActionPlan ActionPlan { get; set; } = new();
    }

    public enum RecommendationLevel
    {
        Poor,
        Fair,
        Good,
        Strong,
        Excellent
    }

    public enum RiskLevel
    {
        Low,
        Medium,
        High
    }

    public enum SeverityLevel
    {
        Low,
        Medium,
        High
    }

    public enum ImportanceLevel
    {
        Low,
        Medium,
        High
    }

    public enum ScoreType
    {
        AtsCompatibility,
        KeywordOptimization,
        FormattingStructure,
        Grammar,
        Spelling,
        SyntaxReadability,
        ProfessionalTone,
        FlowOrganization,
        AccomplishmentsImpact,
        SkillsPresentation,
        WorkExperienceQuality,
        EducationCertifications
    }

    public class ScoreBreakdown
    {

        public ScoreType ScoreType { get; set; }

        [Range(0, 100)]
        public int Score { get; set; }

       
    }

    public class SummaryAnalysis
    {
        public List<string> Strengths { get; set; } = [];

        public List<string> Weaknesses { get; set; } = [];

        public List<string> TopImprovements { get; set; } = [];
    }

    public class AtsFindings
    {
        public bool IsATSFriendly { get; set; }

        public RiskLevel RiskLevel { get; set; }

        public List<AtsIssue> Issues { get; set; } = [];
    }

    public class AtsIssue
    {
        public SeverityLevel Severity { get; set; }

        public string Category { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Recommendation { get; set; } = string.Empty;
    }

    public class GrammarIssue
    {
        public string Text { get; set; } = string.Empty;

        public string Issue { get; set; } = string.Empty;

        public string Suggestion { get; set; } = string.Empty;
    }

    public class SpellingIssue
    {
        public string Text { get; set; } = string.Empty;

        public string Correction { get; set; } = string.Empty;
    }

    public class KeywordSuggestion
    {
        public string Keyword { get; set; } = string.Empty;

        public ImportanceLevel Importance { get; set; }

        public string Reason { get; set; } = string.Empty;
    }

    public class SectionAnalysis
    {
        public SectionScore Summary { get; set; } = new();

        public SectionScore Skills { get; set; } = new();

        public SectionScore Experience { get; set; } = new();

        public SectionScore Education { get; set; } = new();
    }

    public class SectionScore
    {
        [Range(0, 100)]
        public int Score { get; set; }

        public string Feedback { get; set; } = string.Empty;
    }

    public class BulletPointRecommendation
    {
        public string Original { get; set; } = string.Empty;

        public string Improved { get; set; } = string.Empty;

        public string Reason { get; set; } = string.Empty;
    }

    public class ActionPlan
    {
        public List<string> HighPriority { get; set; } = [];

        public List<string> MediumPriority { get; set; } = [];

        public List<string> LowPriority { get; set; } = [];
    }
}
