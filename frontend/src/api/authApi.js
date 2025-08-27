// src/api/authApi.js
import axios from 'axios';
import api from './axiosInstance';

const BASE_URL = import.meta.env.VITE_BACKEND_URL; // change to backend URL

// Register
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/signup`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Login
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(
        `${BASE_URL}/auth/login`, 
        credentials,
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// verify and get current user's info
export const getCurrentUser = async () => {
    try {
        const res = await api.get(`${BASE_URL}/auth/verify`, { withCredentials: true });
        return res.data; // you send back user object from backend
    } catch (error) {
        return {message: error.response?.data || error, success: false} ;
    }
};

// Logout user
export const LogoutUser = async () => {
    try {
        const res = await api.get(`${BASE_URL}/auth/logout`, { withCredentials: true });
        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
