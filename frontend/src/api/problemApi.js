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

export const UpdateProblem = async (id, data) => {
  try {
    const response = await axios.put(
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
    const response = await axios.delete(
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
    const response = await axios.post(
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
    const response = await axios.get(
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
    const response = await axios.put(
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
    const response = await axios.delete(
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
    const response = await axios.post(
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
    const response = await axios.post(
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
    const response = await axios.post(
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
  console.log("called leaderboard")
  try {
    const response = await axios.get(
        `${BASE_URL}/api/user/leaderboard`, 
        { withCredentials: true }
    );
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
