import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "Data/Redux/Store";
import { DomainType, getTodoTC } from "Data/Redux/Reducers/TodolistReducer";
import { Todolist } from "../Todolist/Todolist";
import s from "./Todolists.module.css";
import { selectTasks } from "components/Todolists/TTodolists.selectors";

export const Todolists = () => {
  const dispatch = useAppDispatch();
  const todo = useAppSelector<DomainType[]>(selectTasks);
  useEffect(() => {
    dispatch(getTodoTC());
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
