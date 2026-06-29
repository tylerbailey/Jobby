export interface ResumeAnalysisResponse {
    overallScore: number;
    recommendation: RecommendationLevel;
    scores: ScoreBreakdown[];
    summary: SummaryAnalysis;
    atsFindings: AtsFindings;
    grammarIssues: GrammarIssue[];
    spellingIssues: SpellingIssue[];
    keywordSuggestions: KeywordSuggestion[];
    sectionAnalysis: SectionAnalysis;
    bulletPointRecommendations: BulletPointRecommendation[];
    missingSections: string[];
    actionPlan: ActionPlan;
}

export type RecommendationLevel =
    | "Poor"
    | "Fair"
    | "Good"
    | "Strong"
    | "Excellent";

export type RiskLevel =
    | "Low"
    | "Medium"
    | "High";

export type SeverityLevel =
    | "Low"
    | "Medium"
    | "High";

export type ImportanceLevel =
    | "Low"
    | "Medium"
    | "High";

export type ScoreType =
    | "AtsCompatibility"
    | "KeywordOptimization"
    | "FormattingStructure"
    | "Grammar"
    | "Spelling"
    | "SyntaxReadability"
    | "ProfessionalTone"
    | "FlowOrganization"
    | "AccomplishmentsImpact"
    | "SkillsPresentation"
    | "WorkExperienceQuality"
    | "EducationCertifications";


export interface ScoreBreakdown {
    scoreType: ScoreType;
    score: number;
}

export interface SummaryAnalysis {
    strengths: string[];
    weaknesses: string[];
    topImprovements: string[];
}

export interface AtsFindings {
    isATSFriendly: boolean;
    riskLevel: RiskLevel;
    issues: AtsIssue[];
}

export interface AtsIssue {
    severity: SeverityLevel;
    category: string;
    description: string;
    recommendation: string;
}

export interface GrammarIssue {
    text: string;
    issue: string;
    suggestion: string;
}

export interface SpellingIssue {
    text: string;
    correction: string;
}

export interface KeywordSuggestion {
    keyword: string;
    importance: ImportanceLevel;
    reason: string;
}

export interface SectionAnalysis {
    summary: SectionScore;
    skills: SectionScore;
    experience: SectionScore;
    education: SectionScore;
}

export interface SectionScore {
    score: number;
    feedback: string;
}

export interface BulletPointRecommendation {
    original: string;
    improved: string;
    reason: string;
}

export interface ActionPlan {
    highPriority: string[];
    mediumPriority: string[];
    lowPriority: string[];
}


export const RecommendationLevelLabels: Record<RecommendationLevel, string> = {
    Poor: "Poor",
    Fair: "Fair",
    Good: "Good",
    Strong: "Strong",
    Excellent: "Excellent",
};

export const RiskLevelLabels: Record<RiskLevel, string> = {
    Low: "Low Risk",
    Medium: "Medium Risk",
    High: "High Risk",
};

export const SeverityLevelLabels: Record<SeverityLevel, string> = {
    Low: "Low",
    Medium: "Medium",
    High: "High",
};

export const ImportanceLevelLabels: Record<ImportanceLevel, string> = {
    Low: "Low Importance",
    Medium: "Medium Importance",
    High: "High Importance",
};

export const ScoreTypeLabels: Record<ScoreType, string> = {
    AtsCompatibility: "ATS Compatibility",
    KeywordOptimization: "Keyword Optimization",
    FormattingStructure: "Formatting & Structure",
    Grammar: "Grammar",
    Spelling: "Spelling",
    SyntaxReadability: "Syntax & Readability",
    ProfessionalTone: "Professional Tone",
    FlowOrganization: "Flow & Organization",
    AccomplishmentsImpact: "Accomplishments & Impact",
    SkillsPresentation: "Skills Presentation",
    WorkExperienceQuality: "Work Experience Quality",
    EducationCertifications: "Education & Certifications",
};

/* =========================================================
   OPTIONAL HELPERS (very useful in UI)
========================================================= */

export function getRecommendationLabel(value: RecommendationLevel) {
    return RecommendationLevelLabels[value];
}

export function getRiskLabel(value: RiskLevel) {
    return RiskLevelLabels[value];
}

export function getScoreTypeLabel(value: ScoreType) {
    return ScoreTypeLabels[value];
}