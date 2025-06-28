import React from 'react';
import { Briefcase, X } from 'lucide-react';
import toast from 'react-hot-toast';

const JobDescriptionInput = ({ jobDescription, setJobDescription }) => {
  const handleTextChange = (e) => {
    setJobDescription(e.target.value);
  };

  const clearJobDescription = () => {
    setJobDescription('');
    toast.success('Job description cleared');
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Job Description</h2>
        {jobDescription && (
          <button
            onClick={clearJobDescription}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Paste the job description here:
        </label>
        <textarea
          value={jobDescription}
          onChange={handleTextChange}
          placeholder="Paste the job description, requirements, and responsibilities..."
          className="input-field min-h-[200px] resize-none"
          rows={8}
        />
      </div>

      {/* Character Count */}
      {jobDescription && (
        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
          <span>{jobDescription.length} characters</span>
          <span className="flex items-center">
            <Briefcase className="w-3 h-3 mr-1" />
            Job description loaded
          </span>
        </div>
      )}

      {/* Tips */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-1">💡 Tips for better analysis:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Include the full job description with requirements and responsibilities</li>
          <li>• Make sure to include technical skills and qualifications</li>
          <li>• The more detailed the description, the better the analysis</li>
        </ul>
      </div>
    </div>
  );
};

export default JobDescriptionInput; 