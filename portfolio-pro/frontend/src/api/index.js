// src/api/index.js
import axios from 'axios';

// Dynamically switches between local testing and production
export const BASE_URL = import.meta.env.MODE === 'development' 
    ? 'http://localhost:5000' 
    : 'https://your-production-backend.com';

const API = axios.create({
    baseURL: `${BASE_URL}/api`,
});

// Interceptor to inject the Admin JWT token into secure requests automatically
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;