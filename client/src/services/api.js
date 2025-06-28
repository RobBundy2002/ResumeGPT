import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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