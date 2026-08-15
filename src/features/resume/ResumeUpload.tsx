import { FileText, Upload, X } from 'lucide-react';
import type { ParsedResume } from '../../types/resume';
import { parseResumeFile } from '../../services/pdfParser';

interface ResumeUploadProps {
  parsedResume: ParsedResume | null;
  resumeText: string;
  error: string;
  onParsed: (resume: ParsedResume) => void;
  onTextChange: (text: string) => void;
  onError: (message: string) => void;
  onClear: () => void;
}

export function ResumeUpload({ parsedResume, resumeText, error, onParsed, onTextChange, onError, onClear }: ResumeUploadProps) {
  async function handleFile(file: File | undefined) {
    if (!file) return;
    try {
      onError('');
      onParsed(await parseResumeFile(file));
    } catch (parseError) {
      onError(parseError instanceof Error ? parseError.message : 'Unable to parse resume.');
    }
  }

  return (
    <section className="panel">
      <div className="section-title">
        <h2>Resume</h2>
        {resumeText && (
          <button type="button" className="icon-button" onClick={onClear} aria-label="Clear resume">
            <X size={18} />
          </button>
        )}
      </div>

      <label className="upload-zone">
        <Upload size={22} />
        <span>Upload PDF or TXT</span>
        <input
          aria-label="Upload resume"
          type="file"
          accept=".pdf,.txt,application/pdf,text/plain"
          onChange={(event) => void handleFile(event.target.files?.[0])}
        />
      </label>

      {parsedResume && (
        <div className="file-state">
          <FileText size={16} />
          <span>{parsedResume.fileName}</span>
          <span>{parsedResume.characterCount.toLocaleString()} characters</span>
        </div>
      )}

      {error && <p role="alert" className="error-text">{error}</p>}

      <label className="field-label" htmlFor="resume-text">Parsed resume text</label>
      <textarea
        id="resume-text"
        value={resumeText}
        onChange={(event) => onTextChange(event.target.value)}
        placeholder="Upload a PDF/TXT file or paste resume text here."
        rows={12}
      />
    </section>
  );
}
