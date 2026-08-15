import { skillDefinitions, type SkillDefinition } from '../data/skillAliases';
import { escapeRegExp } from '../utils/text';

export interface NormalizedSkillHit {
  skill: SkillDefinition;
  aliases: string[];
}

export function aliasPattern(alias: string): RegExp {
  const escaped = escapeRegExp(alias).replace(/\\[.\-/ ]/g, '[\\s.\\-/]*');
  return new RegExp(`(^|[^a-z0-9+#.])${escaped}([^a-z0-9+#]|$)`, 'i');
}

export function findAliases(text: string, aliases: string[]): string[] {
  return aliases.filter((alias) => aliasPattern(alias).test(text));
}

export function normalizeSkills(text: string): NormalizedSkillHit[] {
  return skillDefinitions
    .map((skill) => ({ skill, aliases: findAliases(text, skill.aliases) }))
    .filter((hit) => hit.aliases.length > 0);
}

export function getSkillById(id: string): SkillDefinition | undefined {
  return skillDefinitions.find((skill) => skill.id === id);
}
