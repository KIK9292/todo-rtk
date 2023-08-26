import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useAppDispatch, useAppSelector } from "Data/Redux/Store";
import { appActions } from "Data/Redux/Reducers/app-reducer";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const ErrorSnackbar = () => {
  let errorStatus = useAppSelector<string | null>((state) => state.App.error);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(true);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    console.log(errorStatus);
    dispatch(appActions.setNewErrorStatus({ error: null }));
  };
  return (
    <Snackbar open={errorStatus !== null} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
        {errorStatus}
      </Alert>
    </Snackbar>
  );
};
