// src/api/authApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080'; // change to backend URL

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
        const res = await axios.get(`${BASE_URL}/auth/verify`, { withCredentials: true });
        console.log(res.data);
        return res.data; // you send back user object from backend
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Logout user
export const LogoutUser = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/auth/logout`, { withCredentials: true });
        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
