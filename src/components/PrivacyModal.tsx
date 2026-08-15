import { X } from 'lucide-react';

interface PrivacyModalProps {
  open: boolean;
  onClose: () => void;
}

export function PrivacyModal({ open, onClose }: PrivacyModalProps) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="privacy-title">
      <section className="modal">
        <div className="modal-header">
          <h2 id="privacy-title">Privacy Architecture</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close privacy dialog">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <p>ResumeGPT runs core analysis entirely in your browser. No account, database, ResumeGPT server, or resume upload is used.</p>
          <ul>
            <li>PDF and TXT parsing happen locally in browser memory.</li>
            <li>Resume text, job descriptions, and analysis results are not persisted by default.</li>
            <li>The generated AI prompt can be copied manually to a service you choose.</li>
            <li>Advanced direct OpenAI mode uses your own API key and keeps it only in memory.</li>
            <li>Clear Session removes the selected resume, parsed text, job description, local analysis, AI results, and API credentials.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
