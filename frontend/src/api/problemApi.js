// src/api/authApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080'; // change to backend URL

// Register
export const createProblem = async (data) => {
  try {
    const response = await axios.post(
        `${BASE_URL}/api/problem/create`, 
        data,
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const GetAllProblems = async () => {
  try {
    const response = await axios.get(
        `${BASE_URL}/api/problem/get-all`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const GetProblemById = async (id) => {
  try {
    const response = await axios.get(
        `${BASE_URL}/api/problem/${id}`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};