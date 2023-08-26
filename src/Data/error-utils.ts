import {ResponceType} from "./API/APITypes";
import {AppReducerActionsType, setNewErrorStatusAC, setNewPreloaderStatusAC} from "./Redux/Reducers/app-reducer";
import {Dispatch} from "redux";

export type AxiosErrorType={messages:string[]}

export const handleServerAppError=<T>(data:ResponceType<T>,dispatch:ErrorUtilsDispatchType)=>{
    if (data.messages.length) {
        dispatch(setNewErrorStatusAC(data.messages[0]))
    } else {
        dispatch(setNewErrorStatusAC('Some error occurred'))
    }
    dispatch(setNewPreloaderStatusAC('failed'))
}

type ErrorUtilsDispatchType =Dispatch<AppReducerActionsType>


export const handleServerNetworkError=(error:{message:string},dispatch:ErrorUtilsDispatchType)=>{
    dispatch(setNewPreloaderStatusAC('failed'))
    dispatch(setNewErrorStatusAC(error.message))

}