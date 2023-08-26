import { appActions } from "./app-reducer";
import { AllThunkType } from "../Store";
import { FormikErrorType } from "components/Login/Login";
import { authApi } from "Data/API/TodolistAPI";
import { AxiosErrorType, handleServerAppError, handleServerNetworkError } from "Data/error-utils";
import axios from "axios";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    isInitialized: false,
  },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    isInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized;
    },
  },
});

export const authActions = slice.actions;
export const authReducer = slice.reducer;

// thunks
export const loginTC =
  (data: FormikErrorType): AllThunkType =>
  async (dispatch) => {
    dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
    try {
      await authApi.login(data).then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
          dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      });
    } catch (e) {
      if (axios.isAxiosError<AxiosErrorType>(e)) {
        handleServerNetworkError(e, dispatch);
      }
    }
  };

export const logoutTC = (): AllThunkType => async (dispatch) => {
  dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
  try {
    await authApi.logout().then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }));
        dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    });
  } catch (e) {
    if (axios.isAxiosError<AxiosErrorType>(e)) {
      handleServerNetworkError(e, dispatch);
    }
  }
};

export const statusLoginTC = (): AllThunkType => async (dispatch) => {
  dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
  try {
    await authApi.me().then((res) => {
      dispatch(authActions.isInitialized({ isInitialized: true }));
      if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
        dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
      } else {
        // handleServerAppError(res.data,dispatch)
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }));
        dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
      }
    });
  } catch (e) {
    if (axios.isAxiosError<AxiosErrorType>(e)) {
      handleServerNetworkError(e, dispatch);
    }
  }
};
