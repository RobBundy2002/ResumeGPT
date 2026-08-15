export interface AnalysisInput {
  resumeText: string;
  jobDescription: string;
}

export interface Evidence {
  source: 'resume' | 'jobDescription';
  skillId: string;
  label: string;
  snippet: string;
  required?: boolean;
  preferred?: boolean;
}

export interface SkillMatch {
  skillId: string;
  label: string;
  category: string;
  resumeAliases: string[];
  jobAliases: string[];
  matched: boolean;
  required: boolean;
  preferred: boolean;
  resumeEvidence: Evidence[];
  jobEvidence: Evidence[];
}

export interface CategoryScore {
  category: string;
  score: number;
  matched: number;
  total: number;
  requiredMatched: number;
  requiredTotal: number;
}

export interface KeywordCoverage {
  matched: number;
  total: number;
  requiredMatched: number;
  requiredTotal: number;
  preferredMatched: number;
  preferredTotal: number;
}

export interface MatchAnalysis {
  input: AnalysisInput;
  overallScore: number;
  keywordCoverage: KeywordCoverage;
  categoryScores: CategoryScore[];
  skillMatches: SkillMatch[];
  matchedSkills: SkillMatch[];
  potentialGaps: SkillMatch[];
  evidence: Evidence[];
  explanation: string[];
  createdAt: string;
}

export interface ResumeRewrite {
  original: string;
  suggested: string;
  supportNotes: string;
}

export interface AIAnalysisResult {
  summary: string;
  strengths: string[];
  gaps: string[];
  suggestions: string[];
  resumeRewrites: ResumeRewrite[];
  warnings: string[];
}
