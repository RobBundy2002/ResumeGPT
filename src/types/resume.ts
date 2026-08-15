export type ResumeFileKind = 'pdf' | 'txt';

export interface ResumeFileValidation {
  valid: boolean;
  kind?: ResumeFileKind;
  error?: string;
}

export interface ParsedResume {
  text: string;
  fileName: string;
  kind: ResumeFileKind;
  characterCount: number;
}
