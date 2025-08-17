// src/store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUser, loginUser, LogoutUser } from "../api/authApi";
import { clearDraftsForUser } from "../utils/clearUserDrafts";

// Thunk: fetch user on app load
// export const fetchUser = createAsyncThunk("auth/fetchUser", async (_, thunkAPI) => {
//   try {
//     const res = await getCurrentUser();
//     if (res.success) return res.user;
//     return thunkAPI.rejectWithValue(res.message);
//   } catch (err) {
//     return thunkAPI.rejectWithValue(err.response?.data || err.message);
//   }
// });

export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
  try {
    const res = await getCurrentUser();
    if (res.success) return res;
    return rejectWithValue(res.message);
  } catch (err) {
    let error = err // cast the error for access
    if (!error.res) {
      throw err
    }
    // We got validation errors, let's return those so we can reference in our component and set form errors
    return rejectWithValue(error.response.data)
  }
})

// Thunk: login
// export const login = createAsyncThunk("auth/login", async (credentials, thunkAPI) => {
//   try {
//     const res = await loginUser(credentials);
//     console.log(res)
//     if (res.success) return res;
//     return thunkAPI.rejectWithValue(res.message);
//   } catch (err) {
//     return thunkAPI.rejectWithValue(err.response?.data || err.message);
//   }
// });

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginUser(credentials);
    if (response.success) return response;
    return rejectWithValue(response.message);
  } catch (err) {
    let error = err // cast the error for access
    if (!error.response) {
      throw err
    }
    // We got validation errors, let's return those so we can reference in our component and set form errors
    return rejectWithValue(error.response.data)
  }
})

// Thunk: logout
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const userId = state.auth.user?._id;
    const res = await LogoutUser();
    if (res.success) {
      clearDraftsForUser(userId); // clear indexedDB for this perticular user
      return true
    };
    return thunkAPI.rejectWithValue(res.message);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

const initialState = {
    user: null,
    loading: true,
    error: null,
    accessToken: null,
  }

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchUser
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload?.user;
      state.loading = false;
    });
    builder.addCase(fetchUser.rejected, (state) => {
      state.user = null;
      state.loading = false;
    });

    // login
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload?.user;
      state.loading = false;
      state.error = null;
      state.accessToken = action.payload?.token;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.payload || "Login failed!!!123";
      state.loading = false;
    });

    // logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
    });
  },
});

export const { setAccessToken } = authSlice.actions;

export default authSlice.reducer;
