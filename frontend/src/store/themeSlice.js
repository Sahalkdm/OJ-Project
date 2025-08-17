import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "dark", // "light" | "dark"
  accent: "blue", // optional: custom theme color
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
    setAccent: (state, action) => {
      state.accent = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, setAccent } = themeSlice.actions;
export default themeSlice.reducer;
