import {TodoItemResponceType} from "../../API/APITypes";
import {todolistAPI} from "../../API/TodolistAPI";
import {AllThunkType, RootReducerType} from "../Store";
import {RequestStatusType, setNewErrorStatusAC, setNewPreloaderStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../error-utils";

export type TodoReducerActionType = GetTodoACType
    | RemoveTodolistACType
    | UpdateStatusFilterACType
    | AddNewTodolistACType
    | UpdateTitleTodolistACType
    | SetNewEntityStatusACType

export type FilterValuesType = 'All' | 'Active' | 'Completed';
export type DomainType = TodoItemResponceType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType
}


export const TodolistReducer = (state: DomainType[] = [], action: TodoReducerActionType): DomainType[] => {
    switch (action.type) {
        case 'SET-TODOLISTS' : {
            return action.payload.todos.map((el) => {
                return {...el, filter: 'All', entityStatus: 'idle'}
            })
        }
        case "REMOVE-TODOLIST": {
            return state.filter(el => el.id !== action.payload.todolistId)
        }
        case "UPDATE-STATUS-FILTER": {
            return state.map(el => el.id === action.payload.todolistId ? {...el, filter: action.payload.newStatus} : el)
        }
        case "ADD-TODOLIST": {
            let newTodo: DomainType = {
                id: action.payload.todo.id,
                title: action.payload.todo.title,
                addedDate: action.payload.todo.addedDate,
                order: action.payload.todo.order,
                filter: 'All',
                entityStatus: 'idle'
            }
            return [...state, newTodo]
        }
        case "UPDATE-TITLE-TODOLIST": {
            return state.map(el => el.id === action.payload.todolistId ? {...el, title: action.payload.newTitle} : el)
        }
        case "SET-NEW-ENTITY-STATUS":{
            return state.map(el=>el.id===action.payload.todolistId?{...el,entityStatus:action.payload.newEntityStatus}:el)
        }
        default:
            return state
    }
}
export type GetTodoACType = ReturnType<typeof getTodoAC>
export const getTodoAC = (todos: TodoItemResponceType[]) => {
    return {
        type: 'SET-TODOLISTS',
        payload: {todos}
    } as const
}
export type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>
const removeTodolistAC = (todolistId: string) => {
    return {
        type: "REMOVE-TODOLIST",
        payload: {todolistId}
    } as const
}
export type UpdateStatusFilterACType = ReturnType<typeof updateStatusFilterAC>
export const updateStatusFilterAC = (todolistId: string, newStatus: FilterValuesType) => {
    return {
        type: "UPDATE-STATUS-FILTER",
        payload: {todolistId, newStatus}
    } as const
}
export type AddNewTodolistACType = ReturnType<typeof addNewTodolistAC>
export const addNewTodolistAC = (todo: TodoItemResponceType) => {
    return {
        type: "ADD-TODOLIST",
        payload: {todo}
    } as const
}
type UpdateTitleTodolistACType = ReturnType<typeof updateTitleTodolistAC>
export const updateTitleTodolistAC = (todolistId: string, newTitle: string) => {
    return {
        type: "UPDATE-TITLE-TODOLIST",
        payload: {todolistId, newTitle}
    } as const
}
type SetNewEntityStatusACType = ReturnType<typeof setNewEntityStatusAC>
export const setNewEntityStatusAC = (todolistId: string, newEntityStatus: RequestStatusType) => {
    return {
        type: 'SET-NEW-ENTITY-STATUS',
        payload: {todolistId, newEntityStatus}
    } as const
}

export const getTodoTC = (): AllThunkType => {
    return (dispatch) => {
        dispatch(setNewPreloaderStatusAC('loading'))
        todolistAPI.getTodolists()
            .then(res => {
                dispatch(getTodoAC(res.data))
                dispatch(setNewPreloaderStatusAC('succeeded'))
            })
            .catch((error=>{
                handleServerNetworkError(error,dispatch)
            }))

    }
}

export const removeTodolistTC = (todolistId: string): AllThunkType => {
    return (dispatch) => {
        dispatch(setNewPreloaderStatusAC('loading'))
        dispatch(setNewEntityStatusAC(todolistId,'loading'))
        todolistAPI.deleteTodolists(todolistId)

            .then(res => {
                // dispatch(addNewTodolistAC(res.data.data.item))
                // dispatch(setNewPreloaderStatusAC('succeeded'))
                if (res.data.resultCode === 0) {
                    dispatch(removeTodolistAC(todolistId))
                    dispatch(setNewPreloaderStatusAC('succeeded'))
                    dispatch(setNewEntityStatusAC(todolistId,'succeeded'))
                } else {
                    handleServerAppError(res.data,dispatch)
                    dispatch(setNewEntityStatusAC(todolistId,'failed'))
                }
            })
            .catch((error=>{
                handleServerNetworkError(error,dispatch)
            }))

    }
}
export const addNewTodolistTC = (newTodo: string): AllThunkType => {
    return (dispatch) => {
        dispatch(setNewPreloaderStatusAC('loading'))
        todolistAPI.postTodolists(newTodo)
            .then(res => {
                // dispatch(addNewTodolistAC(res.data.data.item))
                // dispatch(setNewPreloaderStatusAC('succeeded'))
                if (res.data.resultCode === 0) {
                    dispatch(addNewTodolistAC(res.data.data.item))
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

export const updateTitleTodoTC = (todolistId: string, newTitleTodo: string): AllThunkType => {
    return (dispatch) => {
        dispatch(setNewPreloaderStatusAC('loading'))
        todolistAPI.putTodolists(todolistId, newTitleTodo)
            .then((res) => {
                if(res.data.resultCode === 0) {
                    dispatch(updateTitleTodolistAC(todolistId, newTitleTodo))
                    dispatch(setNewPreloaderStatusAC('succeeded'))
                }else{
                    handleServerAppError(res.data,dispatch)
                }
            })
            .catch((error=>{
                handleServerNetworkError(error,dispatch)
            }))
    }
}