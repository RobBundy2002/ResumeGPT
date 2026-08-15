import { describe, expect, it, vi } from 'vitest';
import { validateAIAnalysisResult } from './aiProvider';
import { OpenAIProvider } from './openaiProvider';
import { analyzeMatch } from '../matcher';

describe('AI provider validation', () => {
  it('accepts valid AI JSON shape', () => {
    expect(validateAIAnalysisResult({
      summary: 'Fit is reasonable.',
      strengths: ['Node.js'],
      gaps: ['Kubernetes'],
      suggestions: ['Add supported examples.'],
      resumeRewrites: [{ original: 'Built APIs', suggested: 'Built Node.js APIs', supportNotes: 'Resume mentions APIs.' }],
      warnings: [],
    })).toMatchObject({ summary: 'Fit is reasonable.' });
  });

  it('rejects invalid AI JSON shape', () => {
    expect(() => validateAIAnalysisResult({ summary: 123 })).toThrow();
  });

  it('mocks OpenAI requests and never requires a real key', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        choices: [{ message: { content: JSON.stringify({
          summary: 'Local match plus AI feedback.',
          strengths: ['Node.js'],
          gaps: ['Kubernetes'],
          suggestions: ['Stay truthful.'],
          resumeRewrites: [],
          warnings: ['Do not invent experience.'],
        }) } }],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const provider = new OpenAIProvider({ apiKey: 'test-key' });
    const result = await provider.analyze(analyzeMatch({
      resumeText: 'Node.js',
      jobDescription: 'Required: NodeJS and Kubernetes',
    }));

    expect(result.summary).toContain('AI feedback');
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('api.openai.com'), expect.any(Object));
  });
});
