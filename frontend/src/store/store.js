// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import themeReducer from "./themeSlice";
import tagsReducer from "./tagsSlice";
import contestReducer from "./contestSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    tags: tagsReducer,
    contest: contestReducer,
  },
});