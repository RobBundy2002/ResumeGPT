import type { CategoryScore, KeywordCoverage, SkillMatch } from '../types/analysis';

export function scoreMatches(matches: SkillMatch[]): {
  overallScore: number;
  categoryScores: CategoryScore[];
  keywordCoverage: KeywordCoverage;
  explanation: string[];
} {
  const relevant = matches.filter((match) => match.jobAliases.length > 0);
  const totalWeight = relevant.reduce((sum, match) => sum + weight(match), 0);
  const matchedWeight = relevant.reduce((sum, match) => sum + (match.matched ? weight(match) : 0), 0);
  const overallScore = totalWeight === 0 ? 0 : Math.round((matchedWeight / totalWeight) * 100);

  const categories = Array.from(new Set(relevant.map((match) => match.category))).sort();
  const categoryScores = categories.map((category) => {
    const categoryMatches = relevant.filter((match) => match.category === category);
    const categoryWeight = categoryMatches.reduce((sum, match) => sum + weight(match), 0);
    const categoryMatchedWeight = categoryMatches.reduce((sum, match) => sum + (match.matched ? weight(match) : 0), 0);
    const requiredTotal = categoryMatches.filter((match) => match.required).length;
    const requiredMatched = categoryMatches.filter((match) => match.required && match.matched).length;

    return {
      category,
      score: categoryWeight === 0 ? 0 : Math.round((categoryMatchedWeight / categoryWeight) * 100),
      matched: categoryMatches.filter((match) => match.matched).length,
      total: categoryMatches.length,
      requiredMatched,
      requiredTotal,
    };
  });

  const keywordCoverage = {
    matched: relevant.filter((match) => match.matched).length,
    total: relevant.length,
    requiredMatched: relevant.filter((match) => match.required && match.matched).length,
    requiredTotal: relevant.filter((match) => match.required).length,
    preferredMatched: relevant.filter((match) => match.preferred && match.matched).length,
    preferredTotal: relevant.filter((match) => match.preferred).length,
  };

  return {
    overallScore,
    categoryScores,
    keywordCoverage,
    explanation: [
      `Score is weighted by job-description skills: required skills count 2x, preferred skills 1.5x, and other detected skills 1x.`,
      `${keywordCoverage.matched} of ${keywordCoverage.total} detected job skills were found in the resume.`,
      `${keywordCoverage.requiredMatched} of ${keywordCoverage.requiredTotal} required skills were covered.`,
    ],
  };
}

function weight(match: SkillMatch): number {
  if (match.required) return 2;
  if (match.preferred) return 1.5;
  return 1;
}
