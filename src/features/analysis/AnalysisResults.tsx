import { AlertTriangle, CheckCircle2, Target } from 'lucide-react';
import type { MatchAnalysis } from '../../types/analysis';

interface AnalysisResultsProps {
  analysis: MatchAnalysis | null;
  loading: boolean;
}

export function AnalysisResults({ analysis, loading }: AnalysisResultsProps) {
  if (loading) {
    return <section className="panel status-panel" aria-live="polite">Analyzing locally...</section>;
  }

  if (!analysis) {
    return <section className="panel status-panel">Upload a resume and paste a job description to run local analysis.</section>;
  }

  return (
    <section className="results" aria-label="Analysis results">
      <div className="score-panel">
        <Target size={24} />
        <div>
          <span>Overall Score</span>
          <strong>{analysis.overallScore}/100</strong>
        </div>
      </div>

      <div className="panel">
        <h2>Keyword Coverage</h2>
        <p>{analysis.keywordCoverage.matched} of {analysis.keywordCoverage.total} job skills matched.</p>
        <p>{analysis.keywordCoverage.requiredMatched} of {analysis.keywordCoverage.requiredTotal} required skills covered.</p>
      </div>

      <div className="panel">
        <h2>Category Scores</h2>
        <div className="category-list">
          {analysis.categoryScores.map((category) => (
            <div key={category.category} className="category-row">
              <span>{category.category}</span>
              <strong>{category.score}%</strong>
              <progress value={category.score} max="100" aria-label={`${category.category} score`} />
            </div>
          ))}
        </div>
      </div>

      <SkillList title="Matched Skills" icon="match" skills={analysis.matchedSkills.map((skill) => skill.label)} />
      <SkillList title="Potential Gaps" icon="gap" skills={analysis.potentialGaps.map((skill) => skill.label)} />

      <div className="panel">
        <h2>Evidence</h2>
        <div className="evidence-list">
          {analysis.evidence.slice(0, 12).map((item, index) => (
            <blockquote key={`${item.skillId}-${item.source}-${index}`}>
              <strong>{item.label}</strong>
              <span>{item.source === 'resume' ? 'Resume' : 'Job description'}</span>
              <p>{item.snippet}</p>
            </blockquote>
          ))}
        </div>
      </div>

      <div className="panel">
        <h2>Scoring Explanation</h2>
        {analysis.explanation.map((line) => <p key={line}>{line}</p>)}
      </div>
    </section>
  );
}

function SkillList({ title, icon, skills }: { title: string; icon: 'match' | 'gap'; skills: string[] }) {
  const Icon = icon === 'match' ? CheckCircle2 : AlertTriangle;
  return (
    <div className="panel">
      <div className="inline-title">
        <Icon size={18} />
        <h2>{title}</h2>
      </div>
      <div className="chip-list">
        {skills.length ? skills.map((skill) => <span key={skill} className="chip">{skill}</span>) : <span className="muted">None detected</span>}
      </div>
    </div>
  );
}
