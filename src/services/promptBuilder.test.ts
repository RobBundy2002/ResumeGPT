import { describe, expect, it } from 'vitest';
import { analyzeMatch } from './matcher';
import { buildAIPrompt } from './promptBuilder';

describe('prompt construction', () => {
  it('includes source inputs, deterministic analysis, gaps, evidence, and anti-fabrication rules', () => {
    const analysis = analyzeMatch({
      resumeText: 'Node.js engineer with PostgreSQL experience.',
      jobDescription: 'Required: NodeJS and Kubernetes.',
    });
    const prompt = buildAIPrompt(analysis);
    expect(prompt).toContain('Resume:');
    expect(prompt).toContain('Job description:');
    expect(prompt).toContain('Overall score');
    expect(prompt).toContain('Kubernetes');
    expect(prompt).toContain('Do not fabricate skills');
    expect(prompt).toContain('Evidence snippets');
  });
});
