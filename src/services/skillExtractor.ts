import type { Evidence } from '../types/analysis';
import { normalizeSkills } from './skillNormalizer';
import { sentenceSnippets } from '../utils/text';

const REQUIRED_HINTS = /\b(required|must have|required skills|requirements|minimum qualifications|need(?:ed)?|proficient in)\b/i;
const PREFERRED_HINTS = /\b(preferred|nice to have|bonus|plus|desired|ideally|preferred qualifications)\b/i;

export interface ExtractedSkill {
  skillId: string;
  label: string;
  category: string;
  aliases: string[];
  required: boolean;
  preferred: boolean;
  evidence: Evidence[];
}

export function extractSkills(text: string, source: Evidence['source']): ExtractedSkill[] {
  const snippets = sentenceSnippets(text);
  return normalizeSkills(text).map(({ skill, aliases }) => {
    const evidence = snippets
      .filter((snippet) => normalizeSkills(snippet).some((hit) => hit.skill.id === skill.id))
      .slice(0, 3)
      .map((snippet) => ({
        source,
        skillId: skill.id,
        label: skill.label,
        snippet,
        required: source === 'jobDescription' ? REQUIRED_HINTS.test(snippet) : false,
        preferred: source === 'jobDescription' ? PREFERRED_HINTS.test(snippet) : false,
      }));

    const required = evidence.some((item) => item.required);
    const preferred = !required && evidence.some((item) => item.preferred);

    return {
      skillId: skill.id,
      label: skill.label,
      category: skill.category,
      aliases,
      required,
      preferred,
      evidence,
    };
  });
}
