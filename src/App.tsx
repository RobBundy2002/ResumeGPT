import { ShieldCheck, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { PrivacyModal } from './components/PrivacyModal';
import { AnalysisResults } from './features/analysis/AnalysisResults';
import { AIPanel } from './features/ai/AIPanel';
import { JobDescriptionInput } from './features/job-description/JobDescriptionInput';
import { ResumeUpload } from './features/resume/ResumeUpload';
import { analyzeMatch } from './services/matcher';
import type { AIAnalysisResult, MatchAnalysis } from './types/analysis';
import type { ParsedResume } from './types/resume';

export default function App() {
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<MatchAnalysis | null>(null);
  const [aiResult, setAIResult] = useState<AIAnalysisResult | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [resumeError, setResumeError] = useState('');
  const [loading, setLoading] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const canAnalyze = resumeText.trim().length > 0 && jobDescription.trim().length > 0 && !loading;

  function runAnalysis() {
    if (!canAnalyze) return;
    setLoading(true);
    setAIResult(null);
    window.setTimeout(() => {
      setAnalysis(analyzeMatch({ resumeText, jobDescription }));
      setLoading(false);
    }, 50);
  }

  function clearSession() {
    setParsedResume(null);
    setResumeText('');
    setJobDescription('');
    setAnalysis(null);
    setAIResult(null);
    setApiKey('');
    setResumeError('');
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>ResumeGPT</h1>
          <p>Privacy-first resume matching that runs locally in your browser.</p>
        </div>
        <div className="header-actions">
          <button type="button" className="secondary-button" onClick={() => setPrivacyOpen(true)}>
            <ShieldCheck size={16} />
            Privacy
          </button>
          <button type="button" className="secondary-button" onClick={clearSession}>
            <Trash2 size={16} />
            Clear Session
          </button>
        </div>
      </header>

      <main className="workspace">
        <div className="input-column">
          <ResumeUpload
            parsedResume={parsedResume}
            resumeText={resumeText}
            error={resumeError}
            onParsed={(resume) => {
              setParsedResume(resume);
              setResumeText(resume.text);
            }}
            onTextChange={(text) => {
              setResumeText(text);
              setParsedResume(null);
            }}
            onError={setResumeError}
            onClear={() => {
              setParsedResume(null);
              setResumeText('');
              setAnalysis(null);
            }}
          />
          <JobDescriptionInput value={jobDescription} onChange={setJobDescription} onClear={() => setJobDescription('')} />
          <button type="button" className="primary-button" onClick={runAnalysis} disabled={!canAnalyze}>
            Analyze Match
          </button>
          <AIPanel analysis={analysis} apiKey={apiKey} onApiKeyChange={setApiKey} aiResult={aiResult} onAIResult={setAIResult} />
        </div>
        <AnalysisResults analysis={analysis} loading={loading} />
      </main>

      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </div>
  );
}
