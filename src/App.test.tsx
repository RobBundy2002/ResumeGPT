import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('ResumeGPT app', () => {
  it('handles upload state, job description, results, prompt generation, privacy modal, and clear session', async () => {
    const user = userEvent.setup();
    render(<App />);

    const file = new File(['Built NodeJS services on k8s with postgres.'], 'resume.txt', { type: 'text/plain' });
    await user.upload(screen.getByLabelText(/upload resume/i), file);
    expect(await screen.findByText('resume.txt')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/paste the role requirements/i), 'Required: Kubernetes, Node.js, PostgreSQL, and TypeScript.');
    await user.click(screen.getByRole('button', { name: /analyze match/i }));

    expect(await screen.findByText('Overall Score')).toBeInTheDocument();
    expect(screen.getAllByText('Kubernetes').length).toBeGreaterThan(0);
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThan(0);

    expect((screen.getByLabelText(/generated ai prompt/i) as HTMLTextAreaElement).value).toContain('Do not fabricate skills');

    await user.click(screen.getByRole('button', { name: /privacy/i }));
    expect(screen.getByRole('dialog', { name: /privacy architecture/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /close privacy dialog/i }));

    await user.click(screen.getByRole('button', { name: /clear session/i }));
    await waitFor(() => expect(screen.queryByText('resume.txt')).not.toBeInTheDocument());
    expect(screen.getByLabelText(/parsed resume text/i)).toHaveValue('');
  });

  it('renders invalid file errors', async () => {
    const user = userEvent.setup();
    render(<App />);
    const file = new File(['hello'], 'resume.pdf', { type: 'text/plain' });
    await user.upload(screen.getByLabelText(/upload resume/i), file);
    expect(await screen.findByRole('alert')).toHaveTextContent(/unexpected MIME type/i);
  });

  it('does not render direct API-key AI controls', () => {
    render(<App />);
    expect(screen.queryByLabelText(/openai api key/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /run optional ai/i })).not.toBeInTheDocument();
  });
});
