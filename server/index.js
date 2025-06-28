const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const pdf = require('pdf-parse');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI only if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY) {
  try {
    const OpenAI = require('openai');
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('OpenAI client initialized successfully');
  } catch (error) {
    console.log('OpenAI client initialization failed:', error.message);
  }
} else {
  console.log('No OpenAI API key found, using mock mode');
}

// Add debugging for API key
console.log('OpenAI API Key format check:', {
  hasKey: !!process.env.OPENAI_API_KEY,
  keyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0,
  keyPrefix: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) + '...' : 'none'
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and text files are allowed'), false);
    }
  },
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ResumeGPT API is running' });
});

// Test OpenAI connection
app.get('/api/test-openai', async (req, res) => {
  try {
    if (!openai) {
      return res.json({ 
        apiKeyConfigured: false,
        availableModels: [],
        message: 'OpenAI not configured, using mock mode',
        mode: 'mock'
      });
    }

    const models = ["gpt-4o-mini", "gpt-3.5-turbo", "gpt-4o"];
    let availableModels = [];
    
    for (const model of models) {
      try {
        const completion = await openai.chat.completions.create({
          model: model,
          messages: [{ role: "user", content: "Hello" }],
          max_tokens: 5,
        });
        availableModels.push({ model, status: 'available' });
      } catch (error) {
        availableModels.push({ model, status: 'unavailable', error: error.message });
      }
    }
    
    res.json({ 
      apiKeyConfigured: !!process.env.OPENAI_API_KEY,
      availableModels,
      message: 'OpenAI connection test completed',
      mode: 'openai'
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      apiKeyConfigured: !!process.env.OPENAI_API_KEY,
      mode: 'error'
    });
  }
});

// Upload and parse resume
app.post('/api/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let text = '';
    
    if (req.file.mimetype === 'application/pdf') {
      const pdfBuffer = req.file.buffer;
      const pdfData = await pdf(pdfBuffer);
      text = pdfData.text;
    } else if (req.file.mimetype === 'text/plain') {
      text = req.file.buffer.toString('utf-8');
    }

    res.json({ text, message: 'Resume parsed successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to parse resume' });
  }
});

// Analyze resume against job description
app.post('/api/analyze', async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;

    if (!resume || !jobDescription) {
      return res.status(400).json({ 
        message: 'Both resume and job description are required' 
      });
    }

    // Check if we should use mock mode (when API quota is exceeded or no OpenAI)
    const useMockMode = process.env.USE_MOCK_MODE === 'true' || !openai;
    
    if (useMockMode) {
      console.log('Using mock analysis mode');
      const mockAnalysis = generateMockAnalysis(resume, jobDescription);
      return res.json(mockAnalysis);
    }

    // Create the analysis prompt
    const prompt = `
You are an expert resume analyzer and career coach. Analyze the following resume against the job description and provide a comprehensive assessment.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Please provide your analysis in the following JSON format:
{
  "matchScore": <number between 0-100>,
  "missingKeywords": ["keyword1", "keyword2", ...],
  "matchingKeywords": ["keyword1", "keyword2", ...],
  "suggestions": [
    "Specific suggestion 1",
    "Specific suggestion 2",
    "Specific suggestion 3"
  ],
  "resumeRewrites": [
    {
      "original": "Original bullet point or sentence",
      "suggested": "Improved version that better matches the job requirements"
    }
  ],
  "overallAssessment": "A comprehensive 2-3 sentence assessment of the resume's fit for this position, including strengths and areas for improvement."
}

Guidelines for analysis:
1. Match Score: Consider keyword alignment, experience relevance, skills match, and overall fit
2. Missing Keywords: Identify important skills/terms from the job description not found in the resume
3. Matching Keywords: List skills/terms that appear in both resume and job description
4. Suggestions: Provide 3-5 actionable, specific improvement suggestions
5. Resume Rewrites: Suggest 2-3 specific rewrites of existing bullet points to better match the job
6. Overall Assessment: Be constructive and specific about fit and improvement areas

Return only valid JSON, no additional text.
`;

    // Try different models in order of preference
    const models = ["gpt-4o-mini", "gpt-3.5-turbo", "gpt-4o"];
    let completion;
    let lastError;

    for (const model of models) {
      try {
        completion = await openai.chat.completions.create({
          model: model,
          messages: [
            {
              role: "system",
              content: "You are a professional resume analyzer. Always respond with valid JSON in the exact format requested."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000,
        });
        console.log(`Successfully used model: ${model}`);
        break; // Exit loop if successful
      } catch (error) {
        console.log(`Failed to use model ${model}:`, error.message);
        lastError = error;
        
        // If quota exceeded, fall back to mock mode
        if (error.message.includes('quota') || error.message.includes('429')) {
          console.log('Quota exceeded, falling back to mock analysis');
          const mockAnalysis = generateMockAnalysis(resume, jobDescription);
          return res.json(mockAnalysis);
        }
        
        continue; // Try next model
      }
    }

    if (!completion) {
      // If all models failed and it's not a quota issue, use mock mode
      console.log('All models failed, using mock analysis');
      const mockAnalysis = generateMockAnalysis(resume, jobDescription);
      return res.json(mockAnalysis);
    }

    const responseText = completion.choices[0].message.content;
    
    // Try to parse the JSON response
    let analysis;
    try {
      analysis = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', responseText);
      
      // Fallback analysis
      analysis = {
        matchScore: 50,
        missingKeywords: ["Unable to parse response"],
        matchingKeywords: [],
        suggestions: ["Please try again with a different resume or job description"],
        resumeRewrites: [],
        overallAssessment: "Analysis could not be completed. Please try again."
      };
    }

    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      message: 'Failed to analyze resume',
      error: error.message 
    });
  }
});

// Mock analysis function for demo purposes
function generateMockAnalysis(resume, jobDescription) {
  // Simple keyword matching
  const resumeWords = resume.toLowerCase().split(/\s+/);
  const jobWords = jobDescription.toLowerCase().split(/\s+/);
  
  const commonWords = resumeWords.filter(word => 
    jobWords.includes(word) && word.length > 3
  );
  
  const missingWords = jobWords.filter(word => 
    !resumeWords.includes(word) && word.length > 3
  ).slice(0, 5);
  
  const matchScore = Math.min(85, Math.max(30, commonWords.length * 10));
  
  return {
    matchScore: matchScore,
    missingKeywords: missingWords.slice(0, 3),
    matchingKeywords: [...new Set(commonWords)].slice(0, 5),
    suggestions: [
      "Add more specific technical skills mentioned in the job description",
      "Include quantifiable achievements in your experience section",
      "Highlight relevant certifications or training programs",
      "Use action verbs to start each bullet point",
      "Tailor your summary to match the job requirements"
    ],
    resumeRewrites: [
      {
        original: "Responsible for managing projects",
        suggested: "Led cross-functional teams of 5+ members to deliver 3 major projects on time and under budget"
      },
      {
        original: "Worked with various technologies",
        suggested: "Developed applications using React, Node.js, and AWS, resulting in 40% improved user engagement"
      }
    ],
    overallAssessment: `Your resume shows a ${matchScore >= 70 ? 'good' : 'fair'} match for this position. Focus on adding the missing keywords and quantifying your achievements to improve your chances. The analysis suggests several specific improvements that could significantly enhance your application.`
  };
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 ResumeGPT server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
}); 