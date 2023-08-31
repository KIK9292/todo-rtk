import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "Data/Redux/Store";
import { DomainType, todolistThunk } from "Data/Redux/Reducers/TodolistReducer";
import { Todolist } from "../Todolist/Todolist";
import s from "./Todolists.module.css";
import { selectTasks } from "components/Todolists/TTodolists.selectors";

export const Todolists = () => {
  const dispatch = useAppDispatch();
  const todo = useAppSelector<DomainType[]>(selectTasks);
  useEffect(() => {
    dispatch(todolistThunk.getTodo());
  }, []);

  return (
    <div className={s.todolistsWrapper}>
      {todo.map((el) => {
        return (
          <Todolist
            todolistId={el.id}
            todolistTitle={el.title}
            key={el.id}
            filterStatus={el.filter}
            entityStatus={el.entityStatus}
          />
        );
      })}
    </div>
  );
};
