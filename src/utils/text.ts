export function compactWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function sentenceSnippets(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map(compactWhitespace)
    .filter(Boolean);
}
