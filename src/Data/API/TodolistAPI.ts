import axios, { AxiosResponse } from "axios";
import {
  authModelResponse,
  RemoveTaskArgType,
  ResponceType,
  TasksPutRequestModelType,
  TasksRequestType,
  TasksType,
  TodoItemResponceType,
} from "./APITypes";
import { FormikErrorType } from "components/Login/Login";
import { UpdateTitleTaskArgType } from "Data/API/APITypes";

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "fdf6f163-b057-4eee-9b85-ec1216c43810",
  },
});

export const todolistAPI = {
  getTodolists() {
    return instance.get<TodoItemResponceType[]>("todo-lists");
  },
  postTodolists(title: string) {
    //<100
    return instance.post<
      null,
      AxiosResponse<ResponceType<{ item: TodoItemResponceType }>, { title: string }>,
      { title: string }
    >("todo-lists", { title });
  },
  deleteTodolists(todolistID: string) {
    return instance.delete<ResponceType>(`todo-lists/${todolistID}`);
  },
  putTodolists(todolistID: string, title: string) {
    return instance.put<null, AxiosResponse<ResponceType>, { title: string }>(`todo-lists/${todolistID}`, { title });
  },
  putReorderTodo(todolistID: string, putAfterItemId: string) {
    return instance.put<null, AxiosResponse<ResponceType>, { putAfterItemId: string }>(
      `todo-lists/${todolistID}/tasks`,
      { putAfterItemId },
    );
  },
  getTasks(todolistID: string) {
    return instance.get<TasksRequestType>(`todo-lists/${todolistID}/tasks`);
  },
  postTasks(arg: UpdateTitleTaskArgType) {
    return instance.post<
      ResponceType<{ item: TasksType }>,
      AxiosResponse<ResponceType<{ item: TasksType }>>,
      { title: string }
    >(`todo-lists/${arg.todolistID}/tasks`, { title: arg.title });
  },
  putTask(todolistID: string, taskID: string, model: TasksPutRequestModelType) {
    return instance.put<null, AxiosResponse<ResponceType<{ item: TasksType }>>, TasksPutRequestModelType>(
      `todo-lists/${todolistID}/tasks/${taskID}`,
      model,
    );
  },
  deleteTask(arg: RemoveTaskArgType) {
    return instance.delete<ResponceType>(`todo-lists/${arg.todolistID}/tasks/${arg.taskID}`);
  },
  reorderTasks(todolistID: string, taskID: string, putAfterItemId: string) {
    return instance.put<null, ResponceType, { putAfterItemId: string }>(
      `todo-lists/${todolistID}/tasks/${taskID}/reorder`,
      { putAfterItemId },
    );
  },
};

export const authApi = {
  me() {
    return instance.get<ResponceType<authModelResponse>>("auth/me");
  },
  login(data: FormikErrorType) {
    return instance.post<null, AxiosResponse<ResponceType<{ userId: number }>>, FormikErrorType>("auth/login", data);
  },
  logout() {
    return instance.delete<ResponceType<{ data: {} }>>("auth/login");
  },
};
