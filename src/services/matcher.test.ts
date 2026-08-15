import { describe, expect, it } from 'vitest';
import { analyzeMatch } from './matcher';
import { extractSkills } from './skillExtractor';
import { normalizeSkills } from './skillNormalizer';

describe('skill normalization and extraction', () => {
  it('matches common aliases', () => {
    const hits = normalizeSkills('Built services with k8s, NodeJS, postgres, springboot, js, and ts.');
    expect(hits.map((hit) => hit.skill.id)).toEqual(
      expect.arrayContaining(['kubernetes', 'nodejs', 'postgresql', 'spring-boot', 'javascript', 'typescript']),
    );
  });

  it('prevents Java from matching JavaScript', () => {
    const hits = normalizeSkills('JavaScript and React applications');
    expect(hits.map((hit) => hit.skill.id)).toContain('javascript');
    expect(hits.map((hit) => hit.skill.id)).not.toContain('java');
  });

  it('prevents JS from matching the extension-like suffix in Node.js', () => {
    const hits = normalizeSkills('Node.js services');
    expect(hits.map((hit) => hit.skill.id)).toContain('nodejs');
    expect(hits.map((hit) => hit.skill.id)).not.toContain('javascript');
  });

  it('classifies skills by category and detects requirement hints', () => {
    const skills = extractSkills('Required: Kubernetes and PostgreSQL. Preferred: React.', 'jobDescription');
    const kubernetes = skills.find((skill) => skill.skillId === 'kubernetes');
    const react = skills.find((skill) => skill.skillId === 'react');
    expect(kubernetes?.category).toBe('Cloud and DevOps');
    expect(kubernetes?.required).toBe(true);
    expect(react?.preferred).toBe(true);
  });
});

describe('deterministic matching', () => {
  it('scores matches and generates evidence', () => {
    const analysis = analyzeMatch({
      resumeText: 'Built React and Node.js apps deployed on Kubernetes with PostgreSQL.',
      jobDescription: 'Required: NodeJS, k8s, and postgres. Preferred: TypeScript.',
    });

    expect(analysis.overallScore).toBeGreaterThan(70);
    expect(analysis.matchedSkills.map((skill) => skill.skillId)).toEqual(
      expect.arrayContaining(['nodejs', 'kubernetes', 'postgresql']),
    );
    expect(analysis.potentialGaps.map((skill) => skill.skillId)).toContain('typescript');
    expect(analysis.evidence.length).toBeGreaterThan(0);
    expect(analysis.categoryScores.some((category) => category.category === 'Cloud and DevOps')).toBe(true);
  });

  it('returns zero for empty job skill input', () => {
    const analysis = analyzeMatch({ resumeText: 'React', jobDescription: 'Friendly teammate' });
    expect(analysis.overallScore).toBe(0);
    expect(analysis.keywordCoverage.total).toBe(0);
  });
});
