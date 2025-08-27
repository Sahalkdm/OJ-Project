import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetAllTags } from "../api/problemApi";

export const fetchTags = createAsyncThunk("tags/fetchTags", async () => {
  try {
    const res = await GetAllTags(); 
    if (res?.success) return res?.tags;
    return rejectWithValue(res?.message); 
  } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});

const tagsSlice = createSlice({
  name: "tags",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    addTag: (state, action) => {
      state.list.push(action.payload);
    },
    removeTag: (state, action) => {
      state.list = state.list.filter(tag => tag._id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error Loading Tags!";
      });
  }
});

export const { addTag, removeTag } = tagsSlice.actions;
export default tagsSlice.reducer;
