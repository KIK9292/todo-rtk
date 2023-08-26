import React from "react";
import Grid from "@mui/material/Grid";
import { AddItemForm } from "../AddItemForm/AddIemForm";
import { Todolists } from "../Todolists/Todolists";
import Container from "@mui/material/Container";
import { useAppDispatch, useAppSelector } from "Data/Redux/Store";
import { addNewTodolistTC } from "Data/Redux/Reducers/TodolistReducer";
import { Navigate } from "react-router-dom";

export const MyAppTodolist = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector<boolean>((state) => state.Auth.isLoggedIn);
  const addNewTodo = (newTodo: string) => {
    dispatch(addNewTodolistTC(newTodo));
  };

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }
  return (
    <div>
      <Container fixed>
        <Grid container style={{ padding: "20px" }}>
          <AddItemForm callback={addNewTodo} disabled={false} />
        </Grid>
        <Grid container spacing={3}>
          <Todolists />
        </Grid>
      </Container>
    </div>
  );
};

