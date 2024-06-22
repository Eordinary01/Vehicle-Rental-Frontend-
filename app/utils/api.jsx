// app/utils/api.js
import axios from 'axios';
import { useAuth } from '../context/authContext';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8001/api',
});

API.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

API.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401 && error.response.data.error === 'Token expired') {
        const {logout} = useAuth();
        logout(); // Call logout function on token expiration
        window.location.href = '/auth/login'; // Redirect to login page
    }
    return Promise.reject(error);
});

export default API;
