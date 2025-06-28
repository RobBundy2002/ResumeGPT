import axios from 'axios';

// Determine API URL based on environment
const getApiUrl = () => {
  // For production (GitLab Pages), use the deployed backend URL
  if (process.env.NODE_ENV === 'production') {
    // Replace this with your actual Railway URL
    return process.env.REACT_APP_API_URL || 'https://resumegpt-production-04e3.up.railway.app';
  }
  // For development, use localhost
  return 'http://localhost:5000';
};

const API_BASE_URL = getApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const analyzeResume = async (resumeText, jobDescription) => {
  try {
    const response = await api.post('/api/analyze', {
      resume: resumeText,
      jobDescription: jobDescription,
    });
    
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || 'Failed to analyze resume');
  }
};

export const uploadResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await api.post('/api/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Upload Error:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload resume');
  }
};

export default api; 