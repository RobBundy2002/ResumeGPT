import type { ParsedResume } from '../types/resume';
import { parseTextFile, readFileAsArrayBuffer, validateResumeFile } from './textParser';

export async function parsePdfFile(file: File): Promise<ParsedResume> {
  const validation = validateResumeFile(file);
  if (!validation.valid || validation.kind !== 'pdf') throw new Error(validation.error ?? 'Invalid PDF file.');

  const pdfjs = await import('pdfjs-dist');
  const worker = await import('pdfjs-dist/build/pdf.worker.mjs?url');
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;

  const bytes = new Uint8Array(await readFileAsArrayBuffer(file));
  const document = await pdfjs.getDocument({ data: bytes }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => ('str' in item ? item.str : '')).join(' '));
  }

  const text = pages.join('\n').replace(/\s+/g, ' ').trim();
  if (!text) throw new Error('Resume PDF is empty or unreadable.');
  return { text, fileName: file.name, kind: 'pdf', characterCount: text.length };
}

export async function parseResumeFile(file: File): Promise<ParsedResume> {
  const validation = validateResumeFile(file);
  if (!validation.valid) throw new Error(validation.error ?? 'Invalid resume file.');
  if (validation.kind === 'txt') {
    return parseTextFile(file);
  }
  return parsePdfFile(file);
}
