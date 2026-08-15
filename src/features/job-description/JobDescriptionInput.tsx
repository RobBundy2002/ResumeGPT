import { X } from 'lucide-react';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function JobDescriptionInput({ value, onChange, onClear }: JobDescriptionInputProps) {
  return (
    <section className="panel">
      <div className="section-title">
        <h2>Job Description</h2>
        {value && (
          <button type="button" className="icon-button" onClick={onClear} aria-label="Clear job description">
            <X size={18} />
          </button>
        )}
      </div>
      <label className="field-label" htmlFor="job-description">Paste the role requirements</label>
      <textarea
        id="job-description"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste responsibilities, required skills, and preferred qualifications."
        rows={10}
      />
      <div className="meta-row">{value.length.toLocaleString()} characters</div>
    </section>
  );
}
