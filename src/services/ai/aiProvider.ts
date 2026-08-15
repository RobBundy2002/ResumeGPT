import type { AIAnalysisResult, MatchAnalysis } from '../../types/analysis';

export interface AIProvider {
  analyze(analysis: MatchAnalysis): Promise<AIAnalysisResult>;
}

export function validateAIAnalysisResult(value: unknown): AIAnalysisResult {
  if (!value || typeof value !== 'object') throw new Error('AI response was not an object.');
  const record = value as Record<string, unknown>;

  return {
    summary: stringValue(record.summary, 'summary'),
    strengths: stringArray(record.strengths, 'strengths'),
    gaps: stringArray(record.gaps, 'gaps'),
    suggestions: stringArray(record.suggestions, 'suggestions'),
    warnings: stringArray(record.warnings, 'warnings'),
    resumeRewrites: Array.isArray(record.resumeRewrites)
      ? record.resumeRewrites.map((item) => {
          if (!item || typeof item !== 'object') throw new Error('Invalid resume rewrite.');
          const rewrite = item as Record<string, unknown>;
          return {
            original: stringValue(rewrite.original, 'rewrite.original'),
            suggested: stringValue(rewrite.suggested, 'rewrite.suggested'),
            supportNotes: stringValue(rewrite.supportNotes, 'rewrite.supportNotes'),
          };
        })
      : [],
  };
}

function stringValue(value: unknown, field: string): string {
  if (typeof value !== 'string') throw new Error(`AI response missing ${field}.`);
  return value;
}

function stringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) {
    throw new Error(`AI response missing ${field}.`);
  }
  return value;
}
