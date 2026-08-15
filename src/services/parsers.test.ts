import { describe, expect, it, vi } from 'vitest';
import { parseResumeFile } from './pdfParser';
import { parseTextFile, validateResumeFile } from './textParser';

describe('resume file validation and text parsing', () => {
  it('parses TXT files locally', async () => {
    const file = new File(['React Node.js Kubernetes'], 'resume.txt', { type: 'text/plain' });
    await expect(parseTextFile(file)).resolves.toMatchObject({
      text: 'React Node.js Kubernetes',
      fileName: 'resume.txt',
      kind: 'txt',
    });
  });

  it('rejects invalid extensions', () => {
    const file = new File(['hello'], 'resume.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    expect(validateResumeFile(file)).toMatchObject({ valid: false });
  });

  it('rejects empty files', () => {
    const file = new File([''], 'resume.txt', { type: 'text/plain' });
    expect(validateResumeFile(file)).toMatchObject({ valid: false, error: 'Resume file is empty.' });
  });

  it('rejects unreadable text content', async () => {
    const file = new File(['   '], 'resume.txt', { type: 'text/plain' });
    await expect(parseTextFile(file)).rejects.toThrow('empty or unreadable');
  });
});

vi.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: {},
  getDocument: () => ({
    promise: Promise.resolve({
      numPages: 1,
      getPage: () => Promise.resolve({
        getTextContent: () => Promise.resolve({ items: [{ str: 'PDF resume with Kubernetes' }] }),
      }),
    }),
  }),
}));

vi.mock('pdfjs-dist/build/pdf.worker.mjs?url', () => ({ default: 'mock-worker.js' }));

describe('PDF parsing', () => {
  it('extracts PDF text through a browser-compatible parser', async () => {
    const file = new File([new Uint8Array([1, 2, 3])], 'resume.pdf', { type: 'application/pdf' });
    await expect(parseResumeFile(file)).resolves.toMatchObject({
      text: 'PDF resume with Kubernetes',
      kind: 'pdf',
    });
  });
});
