import { appActions } from "./app-reducer";
import { FormikErrorType } from "components/Login/Login";
import { authApi } from "Data/API/TodolistAPI";
import { handleServerAppError } from "Data/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistActions } from "Data/Redux/Reducers/TodolistReducer";
import { createAppAsyncThunk } from "Data/createAppAsyncThunk";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    isInitialized: false,
  },
  reducers: {
    isInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authThunk.login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(authThunk.logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(authThunk.statusLogin.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  },
});

// thunks

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, FormikErrorType>(
  "auth/login",
  async (data: FormikErrorType, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;

    dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
    try {
      const res = await authApi.login(data);
      if (res.data.resultCode === 0) {
        dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
        return { isLoggedIn: true };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerAppError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(
  "task/logout",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
    try {
      const res = await authApi.logout();
      if (res.data.resultCode === 0) {
        dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
        dispatch(todolistActions.clearTodoData());
        return { isLoggedIn: false };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerAppError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);
const statusLogin = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(
  "task/statusLogin",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
    try {
      const res = await authApi.me();

      if (res.data.resultCode === 0) {
        dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
        return { isLoggedIn: true };
      } else {
        // handleServerAppError(res.data,dispatch)
        dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
        return { isLoggedIn: false };
      }
    } catch (e) {
      handleServerAppError(e, dispatch);
      return rejectWithValue(null);
    } finally {
      dispatch(authActions.isInitialized({ isInitialized: true }));
    }
  },
);

export const authActions = slice.actions;
export const authReducer = slice.reducer;
export const authThunk = { login, logout, statusLogin };
