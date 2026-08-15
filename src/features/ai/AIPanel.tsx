import { Clipboard, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { AIAnalysisResult, MatchAnalysis } from '../../types/analysis';
import { buildAIPrompt } from '../../services/promptBuilder';
import { OpenAIProvider } from '../../services/ai/openaiProvider';

interface AIPanelProps {
  analysis: MatchAnalysis | null;
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  aiResult: AIAnalysisResult | null;
  onAIResult: (result: AIAnalysisResult | null) => void;
}

export function AIPanel({ analysis, apiKey, onApiKeyChange, aiResult, onAIResult }: AIPanelProps) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const prompt = useMemo(() => (analysis ? buildAIPrompt(analysis) : ''), [analysis]);

  async function copyPrompt() {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
  }

  async function runOpenAI() {
    if (!analysis || !apiKey.trim()) return;
    setLoading(true);
    setError('');
    onAIResult(null);
    try {
      const provider = new OpenAIProvider({ apiKey: apiKey.trim() });
      onAIResult(await provider.analyze(analysis));
    } catch (openAIError) {
      setError(openAIError instanceof Error ? openAIError.message : 'AI analysis failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <div className="inline-title">
        <Sparkles size={18} />
        <h2>Optional AI</h2>
      </div>

      <div className="ai-mode">
        <h3>Mode 1: Generate AI Prompt</h3>
        <p>Recommended. Copy this structured prompt into ChatGPT or another AI service.</p>
        <textarea aria-label="Generated AI prompt" readOnly value={prompt} rows={8} />
        <button type="button" className="secondary-button" onClick={() => void copyPrompt()} disabled={!analysis}>
          <Clipboard size={16} />
          {copied ? 'Copied' : 'Copy Prompt'}
        </button>
      </div>

      <div className="ai-mode">
        <h3>Mode 2: Advanced BYO OpenAI Key</h3>
        <p className="warning">
          OpenAI recommends keeping API keys on a backend server. This direct-browser mode is an advanced tradeoff required by a GitHub-Pages-only architecture. Your key is held only in memory.
        </p>
        <label className="field-label" htmlFor="openai-key">OpenAI API key</label>
        <input
          id="openai-key"
          type="password"
          autoComplete="off"
          value={apiKey}
          onChange={(event) => onApiKeyChange(event.target.value)}
          placeholder="sk-..."
        />
        <button type="button" className="secondary-button" onClick={() => void runOpenAI()} disabled={!analysis || !apiKey.trim() || loading}>
          <Sparkles size={16} />
          {loading ? 'Requesting feedback...' : 'Run Optional AI'}
        </button>
        {error && <p role="alert" className="error-text">{error}</p>}
        {aiResult && (
          <div className="ai-result">
            <h3>AI Feedback</h3>
            <p>{aiResult.summary}</p>
            <h4>Suggestions</h4>
            <ul>{aiResult.suggestions.map((item) => <li key={item}>{item}</li>)}</ul>
            {aiResult.warnings.length > 0 && <p className="warning">{aiResult.warnings.join(' ')}</p>}
          </div>
        )}
      </div>
    </section>
  );
}
