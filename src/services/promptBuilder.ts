import type { MatchAnalysis } from '../types/analysis';

export function buildAIPrompt(analysis: MatchAnalysis): string {
  const matched = analysis.matchedSkills.map((skill) => `- ${skill.label} (${skill.category})`).join('\n') || '- None detected';
  const gaps = analysis.potentialGaps.map((skill) => `- ${skill.label} (${skill.category})`).join('\n') || '- None detected';
  const evidence = analysis.evidence
    .slice(0, 20)
    .map((item) => `- ${item.source}: ${item.label}: "${item.snippet}"`)
    .join('\n');

  return `You are helping improve a resume against a job description.

Rules:
- Do not fabricate skills, employers, responsibilities, metrics, degrees, certifications, job titles, projects, or dates.
- Only suggest resume changes supported by the provided resume text.
- If a requested improvement is unsupported, label it as a gap instead of inventing experience.
- Return concise, actionable feedback.

Resume:
${analysis.input.resumeText}

Job description:
${analysis.input.jobDescription}

Deterministic local analysis:
- Overall score: ${analysis.overallScore}/100
- Keyword coverage: ${analysis.keywordCoverage.matched}/${analysis.keywordCoverage.total}
- Required coverage: ${analysis.keywordCoverage.requiredMatched}/${analysis.keywordCoverage.requiredTotal}

Matched skills:
${matched}

Missing or potential-gap skills:
${gaps}

Evidence snippets:
${evidence || '- No evidence snippets detected'}

Please provide:
1. A brief fit summary.
2. The strongest aligned skills.
3. The most important gaps.
4. Resume improvement suggestions that stay truthful.
5. Rewrite suggestions only for existing resume content, with notes explaining what source evidence supports each rewrite.`;
}
