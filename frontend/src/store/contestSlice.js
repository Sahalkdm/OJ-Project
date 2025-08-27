// contestSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getLatestContest } from "../api/contestApi";

// async thunk
export const fetchLatestContest = createAsyncThunk(
  "contest/fetchLatestContest",
  async (_, thunkAPI) => {
    try {
      const res = await getLatestContest();
      if (res.success) return res.contest;
      thunkAPI.rejectWithValue(res.message);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data || "Error getting latest contets info!");
    }
  }
);

const contestSlice = createSlice({
  name: "contest",
  initialState: {
    latestContest: null,
    userStatus:null,
    joinTime:null,
    loading: false,
    error: null,
  },
  reducers: {
    addRegistration: (state) => {
        if (state.latestContest){
            state.latestContest.isRegistered = true;
            state.userStatus = "Registered";
        }
    },
    setContest: (state, action) => {
      state.latestContest = action.payload;
    },
    setUserStatus: (state, action) => {
      state.userStatus = action.payload.status;
      state.joinTime = action.payload.joinTime;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestContest.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLatestContest.fulfilled, (state, action) => {
        state.loading = false;
        state.latestContest = action.payload;
      })
      .addCase(fetchLatestContest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addRegistration, setContest, setUserStatus } = contestSlice.actions;
export default contestSlice.reducer;
