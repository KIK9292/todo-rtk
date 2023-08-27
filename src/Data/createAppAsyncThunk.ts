import { AppDispatchType, RootReducerType } from "Data/Redux/Store";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootReducerType;
  dispatch: AppDispatchType;
  rejectValue: null;
}>();
