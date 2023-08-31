import { ResultCode, TodoItemResponceType } from "Data/API/APITypes";
import { todolistAPI } from "Data/API/TodolistAPI";
import { appActions, RequestStatusType } from "./app-reducer";
import { handleServerAppError } from "Data/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "Data/createAppAsyncThunk";

const slice = createSlice({
  name: "todolists",
  initialState: [] as DomainType[],
  reducers: {
    updateStatusFilter: (
      state,
      action: PayloadAction<{ todolistId: string; filter: FilterValuesType }>,
    ) => {
      const todolistIndex = state.findIndex((el) => el.id === action.payload.todolistId);
      state[todolistIndex].filter = action.payload.filter;
    },
    // addNewTodolist: (state, action: PayloadAction<{ todo: TodoItemResponceType }>) => {
    //   state.unshift({ ...action.payload.todo, filter: "All", entityStatus: "idle" });
    // },
    // updateTitleTodolist: (state, action: PayloadAction<{ todolistId: string; title: string }>) => {
    //   const todolistIndex = state.findIndex((el) => el.id === action.payload.todolistId);
    //   state[todolistIndex].title = action.payload.title;
    // },
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
  extraReducers: (builder) => {
    builder
      .addCase(todolistThunk.getTodo.fulfilled, (state, action) => {
        return action.payload.todos.map((el) => ({ ...el, filter: "All", entityStatus: "idle" }));
      })
      .addCase(todolistThunk.removeTodolist.fulfilled, (state, action) => {
        const todolistIndex = state.findIndex((el) => el.id === action.payload.todolistId);
        state.splice(todolistIndex, 1);
      })
      .addCase(todolistThunk.addNewTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todo, filter: "All", entityStatus: "idle" });
      })
      .addCase(todolistThunk.updateTitleTodo.fulfilled, (state, action) => {
        const todolistIndex = state.findIndex((el) => el.id === action.payload.todolistId);
        state[todolistIndex].title = action.payload.title;
      });
  },
});

const getTodo = createAppAsyncThunk<{ todos: TodoItemResponceType[] }, void>(
  "todolists/getTodo",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
    try {
      const res = await todolistAPI.getTodolists();
      dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
      return { todos: res.data };
    } catch (e) {
      handleServerAppError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);
// export const getTodoTC = (): AllThunkType => {
//   return (dispatch) => {
//     dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
//     todolistAPI
//       .getTodolists()
//       .then((res) => {
//         dispatch(todolistActions.getTodo({ todos: res.data }));
//         dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
//         return res.data;
//       })
//       .then((todos) => {
//         todos.forEach((tl) => dispatch(taskThunks.getTask({ todolistId: tl.id })));
//       })
//       .catch((error) => {
//         handleServerNetworkError(error, dispatch);
//       });
//   };
// };

const removeTodolist = createAppAsyncThunk<{ todolistId: string }, string>(
  "todolists/removeTodolist",
  async (todolistId: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
    try {
      const res = await todolistAPI.deleteTodolists(todolistId);
      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
        dispatch(
          todolistActions.setNewEntityStatus({ todolistId: todolistId, entityStatus: "succeeded" }),
        );
        return { todolistId: todolistId };
      } else {
        handleServerAppError(res.data, dispatch);
        dispatch(
          todolistActions.setNewEntityStatus({ todolistId: todolistId, entityStatus: "failed" }),
        );
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerAppError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);
// export const removeTodolistTC = (todolistId: string): AllThunkType => {
//   return (dispatch) => {
//     dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
//     dispatch(
//       todolistActions.setNewEntityStatus({ todolistId: todolistId, entityStatus: "loading" }),
//     );
//     todolistAPI
//       .deleteTodolists(todolistId)
//
//       .then((res) => {
//         // dispatch(addNewTodolistAC(res.data.data.item))
//         // dispatch(setNewPreloaderStatusAC('succeeded'))
//         if (res.data.resultCode === 0) {
//           dispatch(todolistActions.removeTodolist({ todolistId: todolistId }));
//           dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
//           dispatch(
//             todolistActions.setNewEntityStatus({
//               todolistId: todolistId,
//               entityStatus: "succeeded",
//             }),
//           );
//         } else {
//           handleServerAppError(res.data, dispatch);
//           dispatch(
//             todolistActions.setNewEntityStatus({ todolistId: todolistId, entityStatus: "failed" }),
//           );
//         }
//       })
//       .catch((error) => {
//         handleServerNetworkError(error, dispatch);
//       });
//   };
// };
const addNewTodolist = createAppAsyncThunk<{ todo: TodoItemResponceType }, string>(
  "todolists/addNewTodolist",
  async (newTodo: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
    try {
      const res = await todolistAPI.postTodolists(newTodo);

      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
        return { todo: res.data.data.item };
      } else {
        handleServerAppError(res.data, dispatch);
        dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerAppError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);
// export const addNewTodolistTC = (newTodo: string): AllThunkType => {
//   return (dispatch) => {
//     dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
//     todolistAPI
//       .postTodolists(newTodo)
//       .then((res) => {
//         // dispatch(addNewTodolistAC(res.data.data.item))
//         // dispatch(setNewPreloaderStatusAC('succeeded'))
//         if (res.data.resultCode === 0) {
//           dispatch(todolistActions.addNewTodolist({ todo: res.data.data.item }));
//           dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
//         } else {
//           handleServerAppError(res.data, dispatch);
//         }
//       })
//       .catch((error) => {
//         handleServerNetworkError(error, dispatch);
//       });
//   };
// };
const updateTitleTodo = createAppAsyncThunk<
  { todolistId: string; title: string },
  { todolistId: string; newTitleTodo: string }
>("todolists/updateTitleTodo", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  const { todolistId, newTitleTodo } = arg;
  dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
  try {
    const res = await todolistAPI.putTodolists(todolistId, newTitleTodo);
    if (res.data.resultCode === ResultCode.success) {
      dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));

      return { todolistId: todolistId, title: newTitleTodo };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerAppError(e, dispatch);
    return rejectWithValue(null);
  }
});
// export const updateTitleTodoTC = (todolistId: string, newTitleTodo: string): AllThunkType => {
//   return (dispatch) => {
//     dispatch(appActions.setNewPreloaderStatus({ status: "loading" }));
//     todolistAPI
//       .putTodolists(todolistId, newTitleTodo)
//       .then((res) => {
//         if (res.data.resultCode === 0) {
//           dispatch(
//             todolistActions.updateTitleTodolist({ todolistId: todolistId, title: newTitleTodo }),
//           );
//           dispatch(appActions.setNewPreloaderStatus({ status: "succeeded" }));
//         } else {
//           handleServerAppError(res.data, dispatch);
//         }
//       })
//       .catch((error) => {
//         handleServerNetworkError(error, dispatch);
//       });
//   };
// };
export type FilterValuesType = "All" | "Active" | "Completed";

export type DomainType = TodoItemResponceType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
export const todolistReducer = slice.reducer;
export const todolistActions = slice.actions;
export const todolistThunk = { getTodo, removeTodolist, addNewTodolist, updateTitleTodo };
