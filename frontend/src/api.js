import axios from 'axios';

//Dynamic URL 

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; 

// Axios Instance
const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});

//Auth Token Logic ---
API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

export default API;