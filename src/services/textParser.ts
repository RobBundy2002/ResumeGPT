import type { ParsedResume, ResumeFileValidation } from '../types/resume';

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export function validateResumeFile(file: File): ResumeFileValidation {
  const extension = file.name.toLowerCase().split('.').pop();
  const kind = extension === 'pdf' ? 'pdf' : extension === 'txt' ? 'txt' : undefined;

  if (!kind) return { valid: false, error: 'Use a PDF or TXT resume file.' };
  if (file.size > MAX_RESUME_BYTES) return { valid: false, error: 'Resume file must be 5 MB or smaller.' };
  if (file.size === 0) return { valid: false, error: 'Resume file is empty.' };
  if (file.type && kind === 'pdf' && file.type !== 'application/pdf') return { valid: false, error: 'The selected PDF has an unexpected MIME type.' };
  if (file.type && kind === 'txt' && !['text/plain', 'text/markdown'].includes(file.type)) return { valid: false, error: 'The selected TXT file has an unexpected MIME type.' };

  return { valid: true, kind };
}

export async function parseTextFile(file: File): Promise<ParsedResume> {
  const validation = validateResumeFile(file);
  if (!validation.valid || validation.kind !== 'txt') throw new Error(validation.error ?? 'Invalid TXT file.');
  const text = (await readFileAsText(file)).trim();
  if (!text) throw new Error('Resume text is empty or unreadable.');
  return { text, fileName: file.name, kind: 'txt', characterCount: text.length };
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Resume text is unreadable.'));
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.readAsText(file);
  });
}

export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Resume file is unreadable.'));
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error('Resume file is unreadable.'));
      }
    };
    reader.readAsArrayBuffer(file);
  });
}
