import { AnyAction } from "redux";
import { todolistReducer } from "./Reducers/TodolistReducer";
import { tasksReducer } from "./Reducers/TasksReducer";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { appReducer } from "./Reducers/app-reducer";
import { authReducer } from "./Reducers/authReducer";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    Todolist: todolistReducer,
    Tasks: tasksReducer,
    App: appReducer,
    Auth: authReducer,
  },
});

export type RootReducerType = ReturnType<typeof store.getState>;
export type AppDispatchType = ThunkDispatch<RootReducerType, unknown, AnyAction>;
export type AllThunkType<ReturnType = void> = ThunkAction<
  ReturnType,
  RootReducerType,
  unknown,
  AnyAction
>;
export const useAppDispatch = useDispatch<AppDispatchType>;
export const useAppSelector: TypedUseSelectorHook<RootReducerType> = useSelector;
