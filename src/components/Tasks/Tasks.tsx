import React from "react";
import { useAppDispatch, useAppSelector } from "Data/Redux/Store";
import { Task } from "../Task/Task";
import { FilterValuesType } from "Data/Redux/Reducers/TodolistReducer";
import { selectTasks } from "components/Tasks/Tasks.select";
import { TasksReducerStateType } from "Data/Redux/Reducers/TasksReducer";

type TasksPropsType = {
  todolistId: string;
  filterStatus: FilterValuesType;
};

export const Tasks = (props: TasksPropsType) => {
  const { todolistId, filterStatus } = props;
  const dispatch = useAppDispatch();
  // useEffect(() => {
  //   dispatch(getTasksTC(todolistId));
  // }, []);
  const allTasks = useAppSelector<TasksReducerStateType>(selectTasks);
  let filteredTask = allTasks[todolistId];
  if (filterStatus === "Active") {
    filteredTask = allTasks[todolistId].filter((el) => el.status === 0);
  }
  if (filterStatus === "Completed") {
    filteredTask = allTasks[todolistId].filter((el) => el.status === 2);
  }
  return (
    <div>
      {filteredTask.map((el) => {
        return (
          <Task
            key={el.id}
            titleTask={el.title}
            todolistId={todolistId}
            taskId={el.id}
            checkedStatus={el.status}
          />
        );
      })}
    </div>
  );
};
