import { ResponceType } from "./API/APITypes";
import { appActions } from "./Redux/Reducers/app-reducer";
import { Dispatch } from "redux";

export type AxiosErrorType = { messages: string[] };

export const handleServerAppError = <T>(
  data: ResponceType<T>,
  dispatch: ErrorUtilsDispatchType,
) => {
  if (data.messages.length) {
    dispatch(appActions.setNewErrorStatus({ error: data.messages[0] }));
  } else {
    dispatch(appActions.setNewErrorStatus({ error: "Some error occurred" }));
  }
  dispatch(appActions.setNewPreloaderStatus({ status: "failed" }));
};

type ErrorUtilsDispatchType = Dispatch;

export const handleServerNetworkError = (
  error: { message: string },
  dispatch: ErrorUtilsDispatchType,
) => {
  dispatch(appActions.setNewPreloaderStatus({ status: "failed" }));
  dispatch(appActions.setNewErrorStatus({ error: error.message }));
};
