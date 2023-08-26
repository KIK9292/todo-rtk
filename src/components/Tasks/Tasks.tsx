import React, {useEffect} from 'react';
import {RootReducerType, useAppDispatch} from "../../Data/Redux/Store";
import {useSelector} from "react-redux";
import {getTasksTC} from "../../Data/Redux/Reducers/TasksReducer";
import {Task} from "../Task/Task";
import {FilterValuesType} from "../../Data/Redux/Reducers/TodolistReducer";
import {TasksType} from "../../Data/API/APITypes";

type TasksPropsType = {
    todolistId: string
    filterStatus: FilterValuesType

}

export const Tasks = (props: TasksPropsType) => {
    const {todolistId, filterStatus} = props
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getTasksTC(todolistId))
    }, [])
    const allTasks = useSelector<RootReducerType, TasksType[]>(state => state.Tasks[todolistId])
    let filteredTask = allTasks
    if (filterStatus === 'Active') {
        filteredTask = allTasks.filter(el => el.status === 0)
    }
    if (filterStatus === 'Completed') {
        filteredTask = allTasks.filter(el => el.status === 2)
    }
    return (
        <div>

            {filteredTask.map(el => {
                return (
                    <Task key={el.id} titleTask={el.title} todolistId={todolistId} taskId={el.id}
                          checkedStatus={el.status}/>
                )
            })}

        </div>
    );
};

