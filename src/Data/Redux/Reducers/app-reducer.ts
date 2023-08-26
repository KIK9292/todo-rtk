import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "app",
  initialState: {
    status: "loading" as RequestStatusType,
    error: null as string | null,
  },
  reducers: {
    setNewPreloaderStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status;
    },
    setNewErrorStatus: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
  },
});

export const appReducer = slice.reducer;

export const appActions = slice.actions;
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
