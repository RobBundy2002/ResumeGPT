import type { AIAnalysisResult, MatchAnalysis } from '../../types/analysis';
import { buildAIPrompt } from '../promptBuilder';
import { validateAIAnalysisResult, type AIProvider } from './aiProvider';

export interface OpenAIProviderOptions {
  apiKey: string;
  model?: string;
}

export class OpenAIProvider implements AIProvider {
  private readonly apiKey: string;
  private readonly model: string;

  constructor(options: OpenAIProviderOptions) {
    this.apiKey = options.apiKey;
    this.model = options.model ?? 'gpt-4o-mini';
  }

  async analyze(analysis: MatchAnalysis): Promise<AIAnalysisResult> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'Return only JSON with summary, strengths, gaps, suggestions, resumeRewrites, and warnings. Never invent unsupported resume details.',
          },
          {
            role: 'user',
            content: `${buildAIPrompt(analysis)}

Return JSON in this shape:
{
  "summary": "string",
  "strengths": ["string"],
  "gaps": ["string"],
  "suggestions": ["string"],
  "resumeRewrites": [{"original": "string", "suggested": "string", "supportNotes": "string"}],
  "warnings": ["string"]
}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed with ${response.status}.`);
    }

    const payload = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new Error('OpenAI response was empty.');
    return validateAIAnalysisResult(JSON.parse(content));
  }
}
