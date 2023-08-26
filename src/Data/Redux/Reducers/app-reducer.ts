export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null
}

type InitialStateType = {
    status:RequestStatusType
    error:string|null
}

export const appReducer = (state: InitialStateType = initialState, action: AppReducerActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.payload.status}
        case "APP/SET-ERROR":
            return {...state,error:action.payload.error}
        default:
            return state
    }
}


export type AppReducerActionsType = SetNewPreloaderStatusACType|SetNewErrorStatusACType
export type SetNewPreloaderStatusACType=ReturnType<typeof setNewPreloaderStatusAC>
export const setNewPreloaderStatusAC=(status:RequestStatusType)=>{
    return{
        type: 'APP/SET-STATUS',
        payload:{status}
    }as const
}
export type SetNewErrorStatusACType=ReturnType<typeof setNewErrorStatusAC>
export const setNewErrorStatusAC=(error:string|null)=>{
    return{
        type: 'APP/SET-ERROR',
        payload:{error}
    }as const
}