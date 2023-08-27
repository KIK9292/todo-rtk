import { todolistActions } from "./TodolistReducer";
import {
  RemoveTaskArgType,
  TasksPutRequestModelType,
  TaskStatuses,
  TasksType,
  UpdateTitleTaskArgType,
} from "Data/API/APITypes";
import { AllThunkType, RootReducerType } from "../Store";
import { todolistAPI } from "Data/API/TodolistAPI";
import { appActions } from "./app-reducer";
import { handleServerAppError, handleServerNetworkError } from "Data/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "Data/createAppAsyncThunk";

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksReducerStateType,
  reducers: {
    updateTask: (state, action: PayloadAction<{ task: TasksType }>) => {
      const taskIndex = state[action.payload.task.todoListId].findIndex((el) => el.id === action.payload.task.id);
      state[action.payload.task.todoListId][taskIndex] = {
        ...state[action.payload.task.todoListId][taskIndex],
        ...action.payload.task,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(taskThunks.addNewTask.fulfilled, (state, action) => {
        state[action.payload.task.todoListId].unshift(action.payload.task);
      })
      .addCase(taskThunks.addNewTask.rejected, () => {})
      .addCase(taskThunks.removeTask.fulfilled, (state, action) => {
        const taskIndex = state[action.payload.todolistID].findIndex((el) => el.id === action.payload.taskID);
        state[action.payload.todolistID].splice(taskIndex, 1);
      })
      .addCase(taskThunks.removeTask.rejected, () => {})
      .addCase(taskThunks.getTask.rejected, () => {})
      .addCase(taskThunks.getTask.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(todolistActions.addNewTodolist, (state, action) => {
        state[action.payload.todo.id] = [];
      })
      .addCase(todolistActions.removeTodolist, (state, action) => {
        delete state[action.payload.todolistId];
      })
      .addCase(todolistActions.getTodo, (state, action) => {
        action.payload.todos.forEach((el) => (state[el.id] = []));
      })
      .addCase(todolistActions.clearTodoData, () => {
        return {};
      });
  },
});

const getTask = createAppAsyncThunk<{ tasks: TasksType[]; todolistId: string }, { todolistId: string }>(
  "tasks/getTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    const { todolistId } = arg;
    dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
    try {
      const res = await todolistAPI.getTasks(arg.todolistId);
      dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
      return { todolistId: todolistId, tasks: res.data.items };
    } catch (e) {
      handleServerAppError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);
const removeTask = createAppAsyncThunk<{ todolistID: string; taskID: string }, RemoveTaskArgType>(
  "tasks/removeTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    const { todolistID, taskID } = arg;
    dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
    try {
      const res = await todolistAPI.deleteTask(arg);
      if (res.data.resultCode === 0) {
        dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
        return { todolistID, taskID };
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
const addNewTask = createAppAsyncThunk<{ task: TasksType }, UpdateTitleTaskArgType>(
  "tasks/addNewTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
    try {
      const res = await todolistAPI.postTasks(arg);
      if (res.data.resultCode === 0) {
        dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
        return { task: res.data.data.item };
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

// const updateStatusTask=
export const _updateStatusTaskTC = (todolistId: string, taskId: string, newStatus: TaskStatuses): AllThunkType => {
  return (dispatch, getState: () => RootReducerType) => {
    dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
    let task = getState().Tasks[todolistId].find((f) => f.id === taskId);
    if (task) {
      const model: TasksPutRequestModelType = {
        title: task.title,
        description: task.description,
        completed: !task.completed,
        status: newStatus,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
      };
      todolistAPI
        .putTask(todolistId, taskId, model)
        // .then(res=>console.log(res.data.item))
        .then((res) => {
          if (res.data.resultCode === 0) {
            dispatch(tasksActions.updateTask({ task: res.data.data.item }));
            dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
          } else {
            handleServerAppError(res.data, dispatch);
          }
        })
        .catch((error) => {
          handleServerNetworkError(error, dispatch);
        });
    }
  };
};
export const updateTitleTaskTC = (todolistId: string, taskId: string, newTitle: string): AllThunkType => {
  return (dispatch, getState: () => RootReducerType) => {
    dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
    let task = getState().Tasks[todolistId].find((f) => f.id === taskId);
    if (task) {
      const model: TasksPutRequestModelType = {
        title: newTitle,
        description: task.description,
        completed: !task.completed,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
      };
      todolistAPI
        .putTask(todolistId, taskId, model)
        // .then(res=>console.log(res.data.item))
        .then((res) => {
          if (res.data.resultCode === 0) {
            dispatch(tasksActions.updateTask({ task: res.data.data.item }));
            dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
          } else {
            handleServerAppError(res.data, dispatch);
          }
        })
        .catch((error) => {
          handleServerNetworkError(error, dispatch);
        });
    }
  };
};
export type TasksReducerStateType = {
  [key: string]: TasksType[];
};

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const taskThunks = { getTask, removeTask, addNewTask };
