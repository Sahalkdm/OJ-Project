import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "dark", // "light" | "dark"
  accent: "blue", // optional: custom theme color
  language: "cpp",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLanguageGlobal: (state, action) => {
      state.language = action.payload;
    },
    setAccent: (state, action) => {
      state.accent = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, setAccent, setLanguageGlobal } = themeSlice.actions;
export default themeSlice.reducer;
