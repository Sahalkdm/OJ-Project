// src/api/axiosInstance.js
import axios from "axios";
import { logout, setAccessToken } from "../store/authSlice";
import { store } from "../store/store";

const BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies automatically
});

// Attach access token to headers
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh access token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only try once
    if ((error.response?.status === 401) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.get(`${BASE_URL}/auth/refresh-token`, {
          withCredentials: true,
        });
        const newAccessToken = res.data.accessToken;
        store.dispatch(setAccessToken(newAccessToken));
        console.log("Token updated")
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest); // retry original request
      } catch (err) {
        store.dispatch(logout()); // redirect to login
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
