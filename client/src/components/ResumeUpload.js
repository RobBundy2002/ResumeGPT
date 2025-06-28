import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ResumeUpload = ({ resumeText, setResumeText }) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // For now, we'll handle text files directly
      if (file.type === 'text/plain') {
        const text = await file.text();
        setResumeText(text);
        toast.success('Resume uploaded successfully!');
      } else if (file.type === 'application/pdf') {
        // For PDF files, we'll need to send to backend for parsing
        const formData = new FormData();
        formData.append('resume', file);
        
        const response = await fetch('/api/upload-resume', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const data = await response.json();
          setResumeText(data.text);
          toast.success('PDF resume uploaded and parsed successfully!');
        } else {
          throw new Error('Failed to upload PDF');
        }
      } else {
        toast.error('Please upload a PDF or text file');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [setResumeText]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    multiple: false
  });

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

      {/* File Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 mb-4 ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        {isUploading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
            <span className="text-sm text-gray-600">Processing...</span>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-1">
              {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
            </p>
            <p className="text-xs text-gray-500">or click to browse (PDF, TXT)</p>
          </div>
        )}
      </div>

      {/* Text Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Or paste your resume text directly:
        </label>
        <textarea
          value={resumeText}
          onChange={handleTextChange}
          placeholder="Paste your resume content here..."
          className="input-field min-h-[200px] resize-none"
          rows={8}
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
    </div>
  );
};

export default ResumeUpload; 