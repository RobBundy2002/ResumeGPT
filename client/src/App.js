import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import ResumeUpload from './components/ResumeUpload';
import JobDescriptionInput from './components/JobDescriptionInput';
import AnalysisResults from './components/AnalysisResults';
import { analyzeResume } from './services/api';

function App() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeResume(resumeText, jobDescription);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const canAnalyze = resumeText.trim() && jobDescription.trim() && !loading;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <ResumeUpload
                resumeText={resumeText}
                setResumeText={setResumeText}
            />

            <JobDescriptionInput 
              jobDescription={jobDescription} 
              setJobDescription={setJobDescription} 
            />
            
            <div className="card">
              <button
                onClick={handleAnalyze}
                disabled={!canAnalyze}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                  canAnalyze
                    ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </div>
                ) : (
                  'Analyze Match'
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {analysis && <AnalysisResults analysis={analysis} />}
            
            {!analysis && (
              <div className="card text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Ready to Analyze
                </h3>
                <p className="text-gray-500">
                  Upload your resume and paste a job description to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App; 