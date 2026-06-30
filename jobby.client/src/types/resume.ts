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

/* =========================================================
   Numeric enum values returned from the API
========================================================= */

export type RecommendationLevel = number;
export type RiskLevel = number;
export type SeverityLevel = number;
export type ImportanceLevel = number;
export type ScoreType = number;

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

export interface ResumeChange {
    id: number;
    originalText: string;
    newText: string;
}

export interface ResumeGenerationResponse {
    documentBase64: string;
    changes: ResumeChange[];
}

/* =========================================================
   Label Maps
========================================================= */

export const RecommendationLevelLabels: Record<number, string> = {
    0: "Poor",
    1: "Fair",
    2: "Good",
    3: "Strong",
    4: "Excellent",
};

export const RiskLevelLabels: Record<number, string> = {
    0: "Low Risk",
    1: "Medium Risk",
    2: "High Risk",
};

export const SeverityLevelLabels: Record<number, string> = {
    0: "Low",
    1: "Medium",
    2: "High",
};

export const ImportanceLevelLabels: Record<number, string> = {
    0: "Low Importance",
    1: "Medium Importance",
    2: "High Importance",
};

export const ScoreTypeLabels: Record<number, string> = {
    0: "ATS Compatibility",
    1: "Keyword Optimization",
    2: "Formatting & Structure",
    3: "Grammar",
    4: "Spelling",
    5: "Syntax & Readability",
    6: "Professional Tone",
    7: "Flow & Organization",
    8: "Accomplishments & Impact",
    9: "Skills Presentation",
    10: "Work Experience Quality",
    11: "Education & Certifications",
};

/* =========================================================
   Helpers
========================================================= */

export const getRecommendationLabel = (value: RecommendationLevel) =>
    RecommendationLevelLabels[value] ?? "Unknown";

export const getRiskLabel = (value: RiskLevel) =>
    RiskLevelLabels[value] ?? "Unknown";

export const getSeverityLabel = (value: SeverityLevel) =>
    SeverityLevelLabels[value] ?? "Unknown";

export const getImportanceLabel = (value: ImportanceLevel) =>
    ImportanceLevelLabels[value] ?? "Unknown";

export const getScoreTypeLabel = (value: ScoreType) =>
    ScoreTypeLabels[value] ?? "Unknown";