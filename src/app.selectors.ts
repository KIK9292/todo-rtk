import { RootReducerType } from "Data/Redux/Store";

export const selectStatus = (state: RootReducerType) => state.App.status;
export const selectIsInitialized = (state: RootReducerType) => state.Auth.isInitialized;
export const selectIsLoggedIn = (state: RootReducerType) => state.Auth.isLoggedIn;
