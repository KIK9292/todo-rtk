import { appActions } from "./Redux/Reducers/app-reducer";
import { Dispatch } from "redux";
import axios from "axios";

export type AxiosErrorType = { messages: string[] };

// export const _handleServerAppError = <T>(
//   data: ResponceType<T>,
//   dispatch: ErrorUtilsDispatchType,
// ) => {
//   if (data.messages.length) {
//     dispatch(appActions.setNewErrorStatus({ error: data.messages[0] }));
//   } else {
//     dispatch(appActions.setNewErrorStatus({ error: "Some error occurred" }));
//   }
//   dispatch(appActions.setNewPreloaderStatus({ status: "failed" }));
// };

export const handleServerAppError = (err: unknown, dispatch: ErrorUtilsDispatchType): void => {
  let errorMessage = "Some error occurred";

  if (axios.isAxiosError(err)) {
    errorMessage = err.response?.data?.message || err?.message || errorMessage;
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`;
  } else {
    errorMessage = JSON.stringify(err);
  }

  dispatch(appActions.setNewErrorStatus({ error: errorMessage }));
  dispatch(appActions.setNewPreloaderStatus({ status: "failed" }));
};

type ErrorUtilsDispatchType = Dispatch;

export const handleServerNetworkError = (error: { message: string }, dispatch: ErrorUtilsDispatchType) => {
  dispatch(appActions.setNewPreloaderStatus({ status: "failed" }));
  dispatch(appActions.setNewErrorStatus({ error: error.message }));
};
