import { TodoItemResponceType } from "Data/API/APITypes";
import { todolistAPI } from "Data/API/TodolistAPI";
import { AllThunkType } from "../Store";
import { appActions, RequestStatusType } from "./app-reducer";
import { handleServerAppError, handleServerNetworkError } from "Data/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { taskThunks } from "Data/Redux/Reducers/TasksReducer";

const slice = createSlice({
  name: "todolists",
  initialState: [] as DomainType[],
  reducers: {
    getTodo: (state, action: PayloadAction<{ todos: TodoItemResponceType[] }>) => {
      return action.payload.todos.map((el) => ({ ...el, filter: "All", entityStatus: "idle" }));
    },
    removeTodolist: (state, action: PayloadAction<{ todolistId: string }>) => {
      const todolistIndex = state.findIndex((el) => el.id === action.payload.todolistId);
      state.splice(todolistIndex, 1);
    },
    updateStatusFilter: (
      state,
      action: PayloadAction<{ todolistId: string; filter: FilterValuesType }>,
    ) => {
      const todolistIndex = state.findIndex((el) => el.id === action.payload.todolistId);
      state[todolistIndex].filter = action.payload.filter;
    },
    addNewTodolist: (state, action: PayloadAction<{ todo: TodoItemResponceType }>) => {
      state.unshift({ ...action.payload.todo, filter: "All", entityStatus: "idle" });
    },
    updateTitleTodolist: (state, action: PayloadAction<{ todolistId: string; title: string }>) => {
      const todolistIndex = state.findIndex((el) => el.id === action.payload.todolistId);
      state[todolistIndex].title = action.payload.title;
    },
    setNewEntityStatus: (
      state,
      action: PayloadAction<{ todolistId: string; entityStatus: RequestStatusType }>,
    ) => {
      const todolistIndex = state.findIndex((el) => el.id === action.payload.todolistId);
      state[todolistIndex].entityStatus = action.payload.entityStatus;
    },
    clearTodoData: () => {
      return [];
    },
  },
});

export const todolistReducer = slice.reducer;
export const todolistActions = slice.actions;

export const getTodoTC = (): AllThunkType => {
  return (dispatch) => {
    dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
    todolistAPI
      .getTodolists()
      .then((res) => {
        dispatch(todolistActions.getTodo({ todos: res.data }));
        dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
        return res.data;
      })
      .then((todos) => {
        todos.forEach((tl) => dispatch(taskThunks.getTask({ todolistId: tl.id })));
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
};

export const removeTodolistTC = (todolistId: string): AllThunkType => {
  return (dispatch) => {
    dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
    dispatch(
      todolistActions.setNewEntityStatus({ todolistId: todolistId, entityStatus: "loading" }),
    );
    todolistAPI
      .deleteTodolists(todolistId)

      .then((res) => {
        // dispatch(addNewTodolistAC(res.data.data.item))
        // dispatch(setNewPreloaderStatusAC('succeeded'))
        if (res.data.resultCode === 0) {
          dispatch(todolistActions.removeTodolist({ todolistId: todolistId }));
          dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
          dispatch(
            todolistActions.setNewEntityStatus({
              todolistId: todolistId,
              entityStatus: "succeeded",
            }),
          );
        } else {
          handleServerAppError(res.data, dispatch);
          dispatch(
            todolistActions.setNewEntityStatus({ todolistId: todolistId, entityStatus: "failed" }),
          );
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
};

export const addNewTodolistTC = (newTodo: string): AllThunkType => {
  return (dispatch) => {
    dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
    todolistAPI
      .postTodolists(newTodo)
      .then((res) => {
        // dispatch(addNewTodolistAC(res.data.data.item))
        // dispatch(setNewPreloaderStatusAC('succeeded'))
        if (res.data.resultCode === 0) {
          dispatch(todolistActions.addNewTodolist({ todo: res.data.data.item }));
          dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
};
export const updateTitleTodoTC = (todolistId: string, newTitleTodo: string): AllThunkType => {
  return (dispatch) => {
    dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
    todolistAPI
      .putTodolists(todolistId, newTitleTodo)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(
            todolistActions.updateTitleTodolist({ todolistId: todolistId, title: newTitleTodo }),
          );
          dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
};

export type FilterValuesType = "All" | "Active" | "Completed";
export type DomainType = TodoItemResponceType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
