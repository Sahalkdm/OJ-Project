import axios from "axios";
import api from "./axiosInstance";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;// change to backend URL

// Create Contest
export const createContest = async (data) => {
  try {
    const response = await api.post(
        `${BASE_URL}/api/contest`, 
        data,
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update Contest
export const updateContest = async (id, data) => {
  try {
    const response = await api.put(
        `${BASE_URL}/api/contest/${id}`, 
        data,
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// delete Contest
export const deleteContest = async (id) => {
  try {
    const response = await api.delete(
        `${BASE_URL}/api/contest/${id}`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get Contest by Id
export const getContestById = async (id) => {
  try {
    const response = await api.get(
        `${BASE_URL}/api/contest/get/${id}`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create Contest by Id
export const getLatestContest = async () => {
  try {
    const response = await api.get(
        `${BASE_URL}/api/contest/latest`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch latest contest",
      details: error.response?.data || null,
    };
  }
};

// Create Contest by Id
export const getAllContests = async () => {
  try {
    const response = await api.get(
        `${BASE_URL}/api/contest/`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// map problems to Contest by Id
export const mapProblemsToContest = async (data) => {
  try {
    const response = await api.post(
        `${BASE_URL}/api/contest/map-to-problems`, 
        data,
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// update map problems to Contest by Id
export const updateProblemMapping = async (data, problemId, contestId) => {
  try {
    const response = await api.put(
        `${BASE_URL}/api/contest/map-to-problems/${contestId}/${problemId}`, 
        data,
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// delete map problems to Contest by Id
export const deleteProblemMapping = async (problemId, contestId) => {
  try {
    const response = await api.delete(
        `${BASE_URL}/api/contest/map-to-problems/${contestId}/${problemId}`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// get problems to Contest by Id
export const getProblemsContest = async (contestId) => {
  try {
    const response = await api.get(
        `${BASE_URL}/api/contest/${contestId}/problems`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Register for contest
export const registerForContest = async (id) => {
  try {
    const response = await api.get(
        `${BASE_URL}/api/contest/register/${id}`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Register for contest
export const startContest = async (id) => {
  try {
    const response = await api.get(
        `${BASE_URL}/api/contest/start/${id}`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Register for contest
export const getUserContestStatus = async (id) => {
  try {
    const response = await api.get(
        `${BASE_URL}/api/contest/user-status/${id}`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create Contest by Id
export const submitContestCode = async (data) => {
  try {
    const response = await api.post(
        `${BASE_URL}/api/contest/submit`, 
        data,
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Exit for contest
export const exitContest = async (id) => {
  try {
    const response = await api.get(
        `${BASE_URL}/api/contest/${id}/exit`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Close the contest for all
export const autoSubmitPendingUsers = async (id) => {
  try {
    const response = await api.get(
        `${BASE_URL}/api/contest/${id}/close-all`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin register a user manually for a contest via email
export const registerUserForContest = async (id,email) => {
  try {
    const response = await api.get(
        `${BASE_URL}/api/contest/${id}/register/${email}`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// get all submissions for a contest
export const getContestSubmissions = async (id) => {
  try {
    const response = await api.get(
        `${BASE_URL}/api/contest/${id}/submissions`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// get all registrations for a contest
export const getContestRegistrations = async (id) => {
  try {
    const response = await api.get(
        `${BASE_URL}/api/contest/${id}/get-registrations`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// get submission for a problem for user
export const getUserProblemSubmissions = async (id, problemId) => {
  try {
    const response = await api.get(
        `${BASE_URL}/api/contest/${id}/problem-submissions/${problemId}`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Leaderboard for the contest
export const getContestLeaderboard = async (id) => {
  try {
    const response = await api.get(
        `${BASE_URL}/api/contest/${id}/leaderboard`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Leaderboard for the contest
export const getContestUserProblemScores = async (id) => {
  try {
    const response = await api.get(
        `${BASE_URL}/api/contest/${id}/contest-scores`, 
        { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};