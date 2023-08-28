import React, { ChangeEvent } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import s from "./Task.module.css";
import Checkbox from "@mui/material/Checkbox";
import { useAppDispatch } from "Data/Redux/Store";
import { taskThunks } from "Data/Redux/Reducers/TasksReducer";
import { EditableSpan } from "../EditableSpan/EditableSpan";
import { TaskStatuses } from "Data/API/APITypes";

type TaskPropsType = {
  todolistId: string;
  taskId: string;
  titleTask: string;
  checkedStatus: number;
};

export const Task = (props: TaskPropsType) => {
  const { todolistId, taskId, titleTask, checkedStatus } = props;
  const dispatch = useAppDispatch();
  const onClickHandler = () => {
    dispatch(taskThunks.removeTask({ todolistID: todolistId, taskID: taskId }));
  };
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let newStatus;
    e.currentTarget.checked ? (newStatus = TaskStatuses.Completed) : (newStatus = TaskStatuses.New);
    dispatch(
      taskThunks.updateTask({
        todolistId: todolistId,
        taskId: taskId,
        domainModel: { status: newStatus },
      }),
    );
  };
  const updateTitleTaskCallback = (newTitle: string) => {
    dispatch(
      taskThunks.updateTask({
        todolistId: todolistId,
        taskId: taskId,
        domainModel: { title: newTitle },
      }),
    );
  };
  const isChecked = checkedStatus === 2;

  return (
    <div className={s.TaskWrapper}>
      <Checkbox
        onChange={onChangeHandler}
        checked={isChecked}
        className={checkedStatus === 2 ? s.taskCompleted : ""}
      />
      <EditableSpan
        value={titleTask}
        onChange={updateTitleTaskCallback}
        style={checkedStatus === 2 ? `${s.taskCompleted} ${s.taskCompletedText}` : ""}
      />
      {/*<h3 className={checkedStatus===2?*/}
      {/*    `${s.taskCompleted} ${s.taskCompletedText}`:""}>{titleTask}</h3>*/}
      <IconButton aria-label="delete" size="large" onClick={onClickHandler}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
};
