// src/api/authApi.js
import axios from 'axios';
import api from './axiosInstance';

const BASE_URL = import.meta.env.VITE_BACKEND_URL; // change to backend URL

// Register
export const createProblem = async (data) => {
  try {
    const response = await api.post(
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
    const response = await api.get(
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
    const response = await api.get(
        `${BASE_URL}/api/problem/${id}`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const UpdateProblem = async (id, data) => {
  try {
    const response = await api.put(
        `${BASE_URL}/api/problem/update/${id}`, 
        data,
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const DeleteProblem = async (id, data) => {
  try {
    const response = await api.delete(
        `${BASE_URL}/api/problem/delete/${id}`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const SaveTestCases = async (id, data) => {
  try {
    const response = await api.post(
        `${BASE_URL}/api/problem/${id}/create-test-cases`, 
        {testCases: data},
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getTestCasesByProblem = async (id) => {
  try {
    const response = await api.get(
        `${BASE_URL}/api/problem/${id}/get-all-test-cases`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const UpdateTestCase = async (id, data) => {
  try {
    const response = await api.put(
        `${BASE_URL}/api/problem/update-test-case/${id}`, 
        data,
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const DeleteTestCase = async (id) => {
  try {
    const response = await api.delete(
        `${BASE_URL}/api/problem/delete-test-case/${id}`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const RunTestCases = async (language, code, testCases) => {
  try {
    const response = await api.post(
        `${BASE_URL}/run/test-cases`, 
        {language, code, testCases},
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const RunCustomTestCase = async (language, code, testcase) => {
  try {
    const response = await api.post(
        `${BASE_URL}/run/custom-test-case`, 
        {language, code, testcase},
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const SubmitCode = async (language, code, problemId) => {
  try {
    const response = await api.post(
        `${BASE_URL}/run/submit-code`, 
        {language, code, problemId},
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const GetLeaderboardInfo = async () => {
  try {
    const response = await api.get(
        `${BASE_URL}/api/user/leaderboard`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const ReviewCode = async (language, code) => {
  try {
    const response = await api.post(
        `${BASE_URL}/run/review-code`, 
        { language, code },
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const GetDashBoard = async () => {
  try {
    const response = await api.get(
        `${BASE_URL}/api/user/dashboard`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const GetAllUsers = async (pageNum, limit, search) => {
  try {
    const response = await api.get(
        `${BASE_URL}/api/user/get-all/?page=${pageNum}&limit=${limit}&search=${search}`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const GetAllSubmissions = async (pageNum, limit, search) => {
  try {
    const response = await api.get(
        `${BASE_URL}/api/user/submissions/?page=${pageNum}&limit=${limit}&search=${search}`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const GetSubmissionsUser = async () => {
  try {
    const response = await api.get(
        `${BASE_URL}/api/user/submissions-user`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const GetSubmissionsUserProblem = async (problem_id) => {
  try {
    const response = await api.get(
        `${BASE_URL}/api/user/submissions-user-problem/${problem_id}`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAdminDashboardStats = async () => {
  try {
    const response = await api.get(
        `${BASE_URL}/api/user/admin-dashboard`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


export const CreateTag = async (data) => {
  try {
    const response = await api.post(
        `${BASE_URL}/api/problem/add-tag`, 
        data,
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const GetAllTags = async () => {
  try {
    const response = await axios.get(
        `${BASE_URL}/api/problem/tags`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};