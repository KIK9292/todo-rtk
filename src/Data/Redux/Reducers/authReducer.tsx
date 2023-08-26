import {setNewPreloaderStatusAC} from "./app-reducer";
import {AllThunkType} from "../Store";
import {FormikErrorType} from "../../../components/Login/Login";
import {authApi} from "../../API/TodolistAPI";
import {AxiosErrorType, handleServerAppError, handleServerNetworkError} from "../../error-utils";
import axios from "axios";


const initialState = {
    isLoggedIn: false,
    isInitialized:false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: AuthReducerType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        case "IS-INITIALIZED":{
            return {...state, isInitialized: action.payload.newValue}
        }
        default:
            return state
    }
}
export type SetIsLoggedInACType=ReturnType<typeof setIsLoggedInAC>
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)
export type IsInitializedACType=ReturnType<typeof isInitializedAC>
export const isInitializedAC=(newValue:boolean)=>{
    return {
        type:"IS-INITIALIZED",
        payload:{newValue}
    }as const
}
// thunks
export const loginTC = (data: FormikErrorType):AllThunkType  =>  async (dispatch)=> {
    dispatch(setNewPreloaderStatusAC('loading'))
    try {
        await authApi.login(data)
            .then(res=>{
                if (res.data.resultCode === 0) {
                    dispatch(setIsLoggedInAC(true))
                    dispatch(setNewPreloaderStatusAC('succeeded'))
                } else {
                    handleServerAppError(res.data,dispatch)
                }
            })
    }
    catch (e) {
       if(axios.isAxiosError<AxiosErrorType>(e)){
           handleServerNetworkError(e,dispatch)
       }
    }
}

export const logoutTC = ():AllThunkType  =>  async (dispatch)=> {
    dispatch(setNewPreloaderStatusAC('loading'))
    try {
        await authApi.logout()
            .then(res=>{
                if (res.data.resultCode === 0) {
                    dispatch(setIsLoggedInAC(false))
                    dispatch(setNewPreloaderStatusAC('succeeded'))
                } else {
                    handleServerAppError(res.data,dispatch)
                }
            })
    }
    catch (e) {
        if(axios.isAxiosError<AxiosErrorType>(e)){
            handleServerNetworkError(e,dispatch)
        }
    }
}

export const statusLoginTC = ():AllThunkType  =>  async (dispatch)=> {
    dispatch(setNewPreloaderStatusAC('loading'))
    try {
        await authApi.me()
            .then(res=>{
                dispatch(isInitializedAC(true))
                if (res.data.resultCode === 0) {
                    dispatch(setIsLoggedInAC(true))
                    dispatch(setNewPreloaderStatusAC('succeeded'))
                } else {
                    // handleServerAppError(res.data,dispatch)
                    dispatch(setIsLoggedInAC(false))
                    dispatch(setNewPreloaderStatusAC('succeeded'))
                }
            })
    }
    catch (e) {
        if(axios.isAxiosError<AxiosErrorType>(e)){
            handleServerNetworkError(e,dispatch)
        }
    }
}

// types
export type AuthReducerType = SetIsLoggedInACType|IsInitializedACType