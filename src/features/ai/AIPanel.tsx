import { Clipboard, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { MatchAnalysis } from '../../types/analysis';
import { buildAIPrompt } from '../../services/promptBuilder';

interface AIPanelProps {
  analysis: MatchAnalysis | null;
}

export function AIPanel({ analysis }: AIPanelProps) {
  const [copied, setCopied] = useState(false);
  const prompt = useMemo(() => (analysis ? buildAIPrompt(analysis) : ''), [analysis]);

  async function copyPrompt() {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
  }

  return (
    <section className="panel">
      <div className="inline-title">
        <Sparkles size={18} />
        <h2>Optional AI</h2>
      </div>

      <div className="ai-mode">
        <h3>Generate AI Prompt</h3>
        <p>Copy this structured prompt into ChatGPT or another AI service when you want optional AI feedback.</p>
        <textarea aria-label="Generated AI prompt" readOnly value={prompt} rows={8} />
        <button type="button" className="secondary-button" onClick={() => void copyPrompt()} disabled={!analysis}>
          <Clipboard size={16} />
          {copied ? 'Copied' : 'Copy Prompt'}
        </button>
      </div>
    </section>
  );
}
