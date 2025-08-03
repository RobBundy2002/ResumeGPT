import React from 'react';
import { FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ResumeUpload = ({ resumeText, setResumeText }) => {
  const handleTextChange = (e) => {
    setResumeText(e.target.value);
  };

  const clearResume = () => {
    setResumeText('');
    toast.success('Resume cleared');
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Resume</h2>
        {resumeText && (
          <button
            onClick={clearResume}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Paste your resume content here:
        </label>
        <textarea
          value={resumeText}
          onChange={handleTextChange}
          placeholder="Paste your resume content here..."
          className="input-field min-h-[300px] resize-none"
          rows={12}
        />
      </div>

      {/* Character Count */}
      {resumeText && (
        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
          <span>{resumeText.length} characters</span>
          <span className="flex items-center">
            <FileText className="w-3 h-3 mr-1" />
            Resume loaded
          </span>
        </div>
      )}

      {/* Tips */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-1">💡 Tips for better analysis:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Include your work experience, skills, and education</li>
          <li>• Make sure to include technical skills and qualifications</li>
          <li>• The more detailed the resume, the better the analysis</li>
        </ul>
      </div>
    </div>
  );
};

export default ResumeUpload; 