import { todolistActions, todolistThunk } from "./TodolistReducer";
import {
  RemoveTaskArgType,
  ResponceType,
  TasksPutRequestModelType,
  TaskStatuses,
  TasksType,
  UpdateStatusTaskArgType,
  UpdateTaskArgType,
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(taskThunks.updateTask.fulfilled, (state, action) => {
        const taskIndex = state[action.payload.todolistId].findIndex(
          (el) => el.id === action.payload.taskId,
        );
        state[action.payload.todolistId][taskIndex] = {
          ...state[action.payload.todolistId][taskIndex],
          ...action.payload.domainModel,
        };
      })
      .addCase(taskThunks.addNewTask.fulfilled, (state, action) => {
        state[action.payload.task.todoListId].unshift(action.payload.task);
      })
      .addCase(taskThunks.addNewTask.rejected, () => {})
      .addCase(taskThunks.removeTask.fulfilled, (state, action) => {
        const taskIndex = state[action.payload.todolistID].findIndex(
          (el) => el.id === action.payload.taskID,
        );
        state[action.payload.todolistID].splice(taskIndex, 1);
      })
      .addCase(taskThunks.removeTask.rejected, () => {})
      .addCase(taskThunks.getTask.rejected, () => {})
      .addCase(taskThunks.getTask.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(todolistThunk.addNewTodolist.fulfilled, (state, action) => {
        state[action.payload.todo.id] = [];
      })
      .addCase(todolistThunk.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.todolistId];
      })
      .addCase(todolistThunk.getTodo.fulfilled, (state, action) => {
        action.payload.todos.forEach((el) => (state[el.id] = []));
      })
      .addCase(todolistActions.clearTodoData, () => {
        return {};
      });
  },
});

const getTask = createAppAsyncThunk<
  { tasks: TasksType[]; todolistId: string },
  { todolistId: string }
>("tasks/getTask", async (arg, thunkAPI) => {
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
});
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
//
const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>(
  "tasks/updateTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI;
    dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
    try {
      let task = getState().Tasks[arg.todolistId].find((f) => f.id === arg.taskId);
      if (!task) {
        console.warn("task not found in the state");
        return rejectWithValue(null);
      }
      const model: TasksPutRequestModelType = {
        title: task.title,
        description: task.description,
        completed: !task.completed,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...arg.domainModel,
      };
      const res = await todolistAPI.putTask(arg.todolistId, arg.taskId, model);
      if (res.data.resultCode === 0) {
        dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
        return arg;
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

export type TasksReducerStateType = {
  [key: string]: TasksType[];
};

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const taskThunks = { getTask, removeTask, addNewTask, updateTask };
