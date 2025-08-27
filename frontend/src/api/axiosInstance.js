// // src/api/axiosInstance.js
// import axios from "axios";
// import { logout, setAccessToken } from "../store/authSlice";
// import { store } from "../store/store";

// const BASE_URL = "http://localhost:8080";

// const api = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true, // send cookies automatically
// });

// // Attach access token to headers
// api.interceptors.request.use(
//   (config) => {
//     const token = store.getState().auth.accessToken;
//     if (token) config.headers["Authorization"] = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Refresh access token on 401
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Only try once
//     if ((error.response?.status === 401) && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const res = await axios.get(`${BASE_URL}/auth/refresh-token`, {
//           withCredentials: true,
//         });
//         const newAccessToken = res.data.accessToken;
//         store.dispatch(setAccessToken(newAccessToken));
//         console.log("Token updated")
//         originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
//         return api(originalRequest); // retry original request
//       } catch (err) {
//         store.dispatch(logout()); // redirect to login
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;

// src/api/axiosInstance.js
import axios from "axios";
import { logout, setAccessToken } from "../store/authSlice";
import { store } from "../store/store";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Attach access token
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------
// Refresh Token Logic
// -------------------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait until refresh finishes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.get(`${BASE_URL}/auth/refresh-token`, {
          withCredentials: true,
        });
        const newAccessToken = res.data.accessToken;
        store.dispatch(setAccessToken(newAccessToken));

        processQueue(null, newAccessToken);
        isRefreshing = false;

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

