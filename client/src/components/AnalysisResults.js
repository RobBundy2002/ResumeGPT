import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  Target,
  Star,
  ArrowRight
} from 'lucide-react';

const AnalysisResults = ({ analysis }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success-600';
    if (score >= 60) return 'text-warning-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-success-50 border-success-200';
    if (score >= 60) return 'bg-warning-50 border-warning-200';
    return 'bg-red-50 border-red-200';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Poor Match';
  };

  return (
    <div className="space-y-6">
      {/* Match Score */}
      <div className={`card ${getScoreBgColor(analysis.matchScore)} border-2`}>
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-gray-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Match Score</h2>
          </div>
          
          <div className="mb-4">
            <div className={`text-4xl font-bold ${getScoreColor(analysis.matchScore)} mb-2`}>
              {analysis.matchScore}/100
            </div>
            <div className={`text-sm font-medium ${getScoreColor(analysis.matchScore)}`}>
              {getScoreLabel(analysis.matchScore)}
            </div>
          </div>

          {/* Score Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${
                analysis.matchScore >= 80 ? 'bg-success-500' :
                analysis.matchScore >= 60 ? 'bg-warning-500' : 'bg-red-500'
              }`}
              style={{ width: `${analysis.matchScore}%` }}
            ></div>
          </div>

          <div className="flex justify-center space-x-4 text-xs text-gray-600">
            <span>Poor</span>
            <span>Fair</span>
            <span>Good</span>
            <span>Excellent</span>
          </div>
        </div>
      </div>

      {/* Missing Keywords */}
      {analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
        <div className="card">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-5 h-5 text-warning-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Missing Keywords</h3>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-3">
              These keywords from the job description are missing from your resume:
            </p>
            <div className="flex flex-wrap gap-2">
              {analysis.missingKeywords.map((keyword, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-warning-100 text-warning-800 text-sm rounded-full border border-warning-200"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Matching Keywords */}
      {analysis.matchingKeywords && analysis.matchingKeywords.length > 0 && (
        <div className="card">
          <div className="flex items-center mb-4">
            <CheckCircle className="w-5 h-5 text-success-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Matching Keywords</h3>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-3">
              Great! These keywords from the job description are found in your resume:
            </p>
            <div className="flex flex-wrap gap-2">
              {analysis.matchingKeywords.map((keyword, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-success-100 text-success-800 text-sm rounded-full border border-success-200"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Improvement Suggestions */}
      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <div className="card">
          <div className="flex items-center mb-4">
            <Lightbulb className="w-5 h-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Improvement Suggestions</h3>
          </div>
          
          <div className="space-y-3">
            {analysis.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-600">{index + 1}</span>
                </div>
                <p className="text-sm text-gray-700">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resume Rewrite Suggestions */}
      {analysis.resumeRewrites && analysis.resumeRewrites.length > 0 && (
        <div className="card">
          <div className="flex items-center mb-4">
            <Star className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Resume Rewrite Suggestions</h3>
          </div>
          
          <div className="space-y-4">
            {analysis.resumeRewrites.map((rewrite, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Suggestion {index + 1}
                  </span>
                </div>
                
                {rewrite.original && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-600 mb-1">Original:</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded border-l-2 border-gray-300">
                      {rewrite.original}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center mb-2">
                  <ArrowRight className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-xs font-medium text-gray-600">Suggested rewrite:</p>
                </div>
                
                <p className="text-sm text-gray-800 bg-primary-50 p-3 rounded border-l-2 border-primary-300">
                  {rewrite.suggested}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overall Assessment */}
      {analysis.overallAssessment && (
        <div className="card">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Overall Assessment</h3>
          </div>
          
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {analysis.overallAssessment}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults; 