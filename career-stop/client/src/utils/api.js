import axios from 'axios';

// Create an axios instance with base URL and default headers
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
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
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
  getProfile: () => api.get('/api/auth/me'),
};

// Test API calls
export const testAPI = {
  getQuestions: () => api.get('/api/test/questions'),
  submitTest: (data) => api.post('/api/test/submit', data),
  getResults: () => api.get('/api/test/results'),
  getResult: (id) => api.get(`/api/test/results/${id}`),
};

// Career API calls
export const careerAPI = {
  getCareers: () => api.get('/api/careers'),
  getCareer: async (id) => {
    console.log('Fetching career with ID:', id);
    const response = await api.get(`/api/careers/${id}`);
    console.log('Career API Response:', response);
    return response;
  },
  selectCareer: (id) => api.post(`/api/careers/${id}/select`),
  unselectCareer: (id) => api.delete(`/api/careers/${id}/select`),
  getSelectedCareers: () => api.get('/api/careers/selected'),
  searchWebCareers: (query) => api.get(`/api/careers/web-search?q=${encodeURIComponent(query)}`),
};

// Recommendation API calls
export const recommendationAPI = {
  getCareerRecommendations: (id) => api.get(`/api/v1/recommendations/career/${id}`),
  getCareerBooks: (id) => api.get(`/api/v1/recommendations/career/${id}/books`),
  getCareerCourses: (id) => api.get(`/api/v1/recommendations/career/${id}/courses`),
  getCareerColleges: (id) => api.get(`/api/v1/recommendations/career/${id}/colleges`),
  getCareerArticles: (id) => api.get(`/api/v1/recommendations/career/${id}/articles`),
};

export default api; 