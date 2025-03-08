import axios from 'axios';

// Create an axios instance with base URL and default headers
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
};

// Test API calls
export const testAPI = {
  getQuestions: () => api.get('/test/questions'),
  submitTest: (answers) => api.post('/test/submit', { answers }),
  getResults: () => api.get('/test/results'),
  getResult: (id) => api.get(`/test/results/${id}`),
};

// Career API calls
export const careerAPI = {
  getCareers: () => api.get('/careers'),
  getCareer: (id) => api.get(`/careers/${id}`),
  selectCareer: (id) => api.post(`/careers/${id}/select`),
  unselectCareer: (id) => api.delete(`/careers/${id}/select`),
  getSelectedCareers: () => api.get('/careers/selected'),
};

// Recommendation API calls
export const recommendationAPI = {
  getCareerRecommendations: (id) => api.get(`/recommendations/career/${id}`),
  getCareerBooks: (id) => api.get(`/recommendations/career/${id}/books`),
  getCareerCourses: (id) => api.get(`/recommendations/career/${id}/courses`),
  getCareerColleges: (id) => api.get(`/recommendations/career/${id}/colleges`),
  getCareerArticles: (id) => api.get(`/recommendations/career/${id}/articles`),
};

export default api; 