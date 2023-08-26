import {AddNewTodolistACType, GetTodoACType, RemoveTodolistACType} from "./TodolistReducer";
import {TasksPutRequestModelType, TaskStatuses, TasksType} from "../../API/APITypes";
import {AllThunkType, RootReducerType} from "../Store";
import {todolistAPI} from "../../API/TodolistAPI";
import {setNewPreloaderStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../error-utils";


export type TasksReducerActionType =
    | GetTodoACType
    | setTasksACType
    | RemoveTaskACType
    | RemoveTodolistACType
    | UpdateTaskACType
    | AddNewTaskACType
    | AddNewTodolistACType

export type TasksReducerState = {
    [key: string]: TasksType[]
}

export const TasksReducer = (state: TasksReducerState = {}, action: TasksReducerActionType): TasksReducerState => {
    switch (action.type) {
        case "SET-TODOLISTS": {
            let newState = {...state}
            action.payload.todos.forEach(el => newState[el.id] = [])
            return newState
        }
        case "SET-TASKS": {
            return {...state, [action.payload.todolistId]: action.payload.tasks}
        }
        case "REMOVE-TASK": {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter(el => el.id !== action.payload.taskId)
            }
        }
        case "REMOVE-TODOLIST": {
            let newState = {...state}
            delete newState[action.payload.todolistId]
            return newState
        }
        case "UPDATE-STATUS": {
            return {
                ...state,
                [action.payload.task.todoListId]: state[action.payload.task.todoListId].map(el => el.id === action.payload.task.id ? action.payload.task : el)
            }
        }
        case "ADD-NEW-TASK": {
            return {
                ...state,
                [action.payload.task.todoListId]: [action.payload.task, ...state[action.payload.task.todoListId]]
            }
        }
        case "ADD-TODOLIST": {
            return {...state, [action.payload.todo.id]: []}
        }
        default:
            return state
    }
}
type setTasksACType = ReturnType<typeof setTasksAC>
export const setTasksAC = (todolistId: string, tasks: TasksType[]) => {
    return {
        type: "SET-TASKS",
        payload: {todolistId, tasks}
    } as const
}
type RemoveTaskACType = ReturnType<typeof removeTaskAC>
export const removeTaskAC = (todolistId: string, taskId: string) => {
    return {
        type: "REMOVE-TASK",
        payload: {todolistId, taskId}
    } as const
}
export type UpdateTaskACType = ReturnType<typeof updateTaskAC>
export const updateTaskAC = (task: TasksType) => {
    return {
        type: "UPDATE-STATUS",
        payload: {task}
    } as const
}
type AddNewTaskACType = ReturnType<typeof addNewTaskAC>
export const addNewTaskAC = (task: TasksType) => {
    return {
        type: "ADD-NEW-TASK",
        payload: {task}
    } as const
}

export const getTasksTC = (todolistId: string): AllThunkType => {
    return (dispatch) => {
        dispatch(setNewPreloaderStatusAC('loading'))
        todolistAPI.getTasks(todolistId)
            .then(res => {
                dispatch(setTasksAC(todolistId, res.data.items))
                dispatch(setNewPreloaderStatusAC('succeeded'))
            })
            .catch((error=>{
                handleServerNetworkError(error,dispatch)
            }))
    }
}

export const removeTaskTC = (todolistId: string, taskId: string): AllThunkType => {
    return (dispatch) => {
        dispatch(setNewPreloaderStatusAC('loading'))
        todolistAPI.deleteTask(todolistId, taskId)
            .then(res => {

                if (res.data.resultCode === 0) {
                    dispatch(removeTaskAC(todolistId, taskId))
                    dispatch(setNewPreloaderStatusAC('succeeded'))
                } else {
                    handleServerAppError(res.data,dispatch)
                }
            })
            .catch((error=>{
                handleServerNetworkError(error,dispatch)
            }))
    }
}
export const updateStatusTaskTC =  (todolistId: string, taskId: string, newStatus: TaskStatuses): AllThunkType => {
    return (dispatch, getState: () => RootReducerType) => {
        dispatch(setNewPreloaderStatusAC('loading'))
        let task = getState().Tasks[todolistId].find(f => f.id === taskId)
        if (task) {
            const model: TasksPutRequestModelType = {
                title: task.title,
                description: task.description,
                completed: !task.completed,
                status: newStatus,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
            }
             todolistAPI.putTask(todolistId, taskId, model)
                // .then(res=>console.log(res.data.item))
                .then(res => {
                    if (res.data.resultCode === 0) {
                        dispatch(updateTaskAC(res.data.data.item))
                        dispatch(setNewPreloaderStatusAC('succeeded'))
                    } else {
                        handleServerAppError(res.data,dispatch)
                    }
                })
                .catch((error=>{
                    handleServerNetworkError(error,dispatch)
                }))

        }

    }
}
export const addNewTaskTC = (todolistId: string, title: string): AllThunkType => {
    return (dispatch) => {
        dispatch(setNewPreloaderStatusAC('loading'))
        todolistAPI.postTasks(todolistId, title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(addNewTaskAC(res.data.data.item))
                    dispatch(setNewPreloaderStatusAC('succeeded'))
                } else {
                    handleServerAppError(res.data,dispatch)
                }
            })
            .catch((error=>{
                handleServerNetworkError(error,dispatch)
            }))
    }
}

export const updateTitleTaskTC = (todolistId: string, taskId: string, newTitle: string): AllThunkType => {
    return (dispatch, getState: () => RootReducerType) => {
        dispatch(setNewPreloaderStatusAC('loading'))
        let task = getState().Tasks[todolistId].find(f => f.id === taskId)
        if (task) {
            const model: TasksPutRequestModelType = {
                title: newTitle,
                description: task.description,
                completed: !task.completed,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
            }
            todolistAPI.putTask(todolistId, taskId, model)
                // .then(res=>console.log(res.data.item))
                .then(res => {
                    if (res.data.resultCode === 0) {
                        dispatch(updateTaskAC(res.data.data.item))
                        dispatch(setNewPreloaderStatusAC('succeeded'))
                    } else {
                        handleServerAppError(res.data,dispatch)
                    }
                })
                .catch((error=>{
                    handleServerNetworkError(error,dispatch)
                }))
        }

    }
}