import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Pets
export const getPets = () => api.get('/pets');
export const getAvailablePets = () => api.get('/pets/available');
export const getPet = (id) => api.get(`/pets/${id}`);

// Applications
export const getApplications = () => api.get('/applications');
export const getApplication = (id) => api.get(`/applications/${id}`);
export const createApplication = (data) => api.post('/applications', data);

// Admin
export const getPendingApplications = () => api.get('/admin/pending');
export const getApprovedApplications = () => api.get('/admin/approved');
export const approveAdoption = (app_no) => api.post(`/admin/approve/${app_no}`);
export const rejectAdoption = (app_no) => api.post(`/admin/reject/${app_no}`);

// Products
export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const restockProduct = (id, qty) => api.post(`/products/${id}/restock`, { qty });

// Shelters
export const getShelters = () => api.get('/shelters');
export const getShelter = (id) => api.get(`/shelters/${id}`);

// Adopters
export const getAdopters = () => api.get('/adopters');
export const getAdopter = (id) => api.get(`/adopters/${id}`);
export const createAdopter = (data) => api.post('/adopters', data);

// Transactions
export const getTransactions = () => api.get('/transactions');
export const getTransaction = (id) => api.get(`/transactions/${id}`);
export const createTransaction = (data) => api.post('/transactions', data);

// Auth
export const loginEmployee = (data) => api.post('/auth/login', data);
export const getEmployee = (emp_id) => api.get(`/auth/me?emp_id=${emp_id}`);

// Services
export const getServices = () => api.get('/services');
export const getService = (id) => api.get(`/services/${id}`);
export const getAdopterServices = (adopter_id) => api.get(`/services/adopter/${adopter_id}`);
export const createService = (data) => api.post('/services', data);

export default api;

