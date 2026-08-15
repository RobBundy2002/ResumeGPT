import type { AnalysisInput, MatchAnalysis, SkillMatch } from '../types/analysis';
import { extractSkills } from './skillExtractor';
import { scoreMatches } from './scoring';

export function analyzeMatch(input: AnalysisInput): MatchAnalysis {
  const resumeSkills = extractSkills(input.resumeText, 'resume');
  const jobSkills = extractSkills(input.jobDescription, 'jobDescription');
  const resumeById = new Map(resumeSkills.map((skill) => [skill.skillId, skill]));

  const skillMatches: SkillMatch[] = jobSkills.map((jobSkill) => {
    const resumeSkill = resumeById.get(jobSkill.skillId);
    return {
      skillId: jobSkill.skillId,
      label: jobSkill.label,
      category: jobSkill.category,
      resumeAliases: resumeSkill?.aliases ?? [],
      jobAliases: jobSkill.aliases,
      matched: Boolean(resumeSkill),
      required: jobSkill.required,
      preferred: jobSkill.preferred,
      resumeEvidence: resumeSkill?.evidence ?? [],
      jobEvidence: jobSkill.evidence,
    };
  });

  const scoring = scoreMatches(skillMatches);
  const evidence = skillMatches.flatMap((match) => [...match.resumeEvidence, ...match.jobEvidence]);

  return {
    input,
    overallScore: scoring.overallScore,
    keywordCoverage: scoring.keywordCoverage,
    categoryScores: scoring.categoryScores,
    skillMatches,
    matchedSkills: skillMatches.filter((match) => match.matched),
    potentialGaps: skillMatches.filter((match) => !match.matched),
    evidence,
    explanation: scoring.explanation,
    createdAt: new Date().toISOString(),
  };
}
