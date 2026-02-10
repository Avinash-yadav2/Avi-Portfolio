import axios from 'axios';

// Backend URL
export const BASE_URL = 'http://localhost:5000'; 

// Axios Instance
const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});

export default API;