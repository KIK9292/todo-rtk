import { todolistActions } from "./TodolistReducer";
import { TasksPutRequestModelType, TaskStatuses, TasksType } from "Data/API/APITypes";
import { AllThunkType, RootReducerType } from "../Store";
import { todolistAPI } from "Data/API/TodolistAPI";
import { appActions } from "./app-reducer";
import { handleServerAppError, handleServerNetworkError } from "Data/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksReducerStateType,
  reducers: {
    removeTask: (state, action: PayloadAction<{ todolistId: string; taskId: string }>) => {
      const taskIndex = state[action.payload.todolistId].findIndex(
        (el) => el.id === action.payload.taskId,
      );
      state[action.payload.todolistId].splice(taskIndex, 1);
    },
    addNewTask: (state, action: PayloadAction<{ task: TasksType }>) => {
      state[action.payload.task.todoListId].unshift(action.payload.task);
    },
    updateTask: (state, action: PayloadAction<{ task: TasksType }>) => {
      const taskIndex = state[action.payload.task.todoListId].findIndex(
        (el) => el.id === action.payload.task.id,
      );
      state[action.payload.task.todoListId][taskIndex] = {
        ...state[action.payload.task.todoListId][taskIndex],
        ...action.payload.task,
      };
    },
    setTasks: (state, action: PayloadAction<{ tasks: TasksType[]; todolistId: string }>) => {
      state[action.payload.todolistId] = action.payload.tasks;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(todolistActions.addNewTodolist, (state, action) => {
        state[action.payload.todo.id] = [];
      })
      .addCase(todolistActions.removeTodolist, (state, action) => {
        delete state[action.payload.todolistId];
      })
      .addCase(todolistActions.getTodo, (state, action) => {
        action.payload.todos.forEach((el) => (state[el.id] = []));
      });
  },
});

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;

export const getTasksTC = (todolistId: string): AllThunkType => {
  return (dispatch) => {
    dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
    todolistAPI
      .getTasks(todolistId)
      .then((res) => {
        dispatch(tasksActions.setTasks({ todolistId: todolistId, tasks: res.data.items }));
        dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
};

export const removeTaskTC = (todolistId: string, taskId: string): AllThunkType => {
  return (dispatch) => {
    dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
    todolistAPI
      .deleteTask(todolistId, taskId)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(tasksActions.removeTask({ todolistId: todolistId, taskId: taskId }));
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

export const updateStatusTaskTC = (
  todolistId: string,
  taskId: string,
  newStatus: TaskStatuses,
): AllThunkType => {
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
export const addNewTaskTC = (todolistId: string, title: string): AllThunkType => {
  return (dispatch) => {
    dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
    todolistAPI
      .postTasks(todolistId, title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(tasksActions.addNewTask({ task: res.data.data.item }));
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
export const updateTitleTaskTC = (
  todolistId: string,
  taskId: string,
  newTitle: string,
): AllThunkType => {
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
