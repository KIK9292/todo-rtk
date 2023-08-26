import React, {useEffect} from 'react';
import {RootReducerType, useAppDispatch, useAppSelector} from "../../Data/Redux/Store";
import {useSelector} from "react-redux";
import {DomainType, getTodoTC} from "../../Data/Redux/Reducers/TodolistReducer";
import {Todolist} from "../Todolist/Todolist";
import s from "./Todolists.module.css"
import {Navigate, useNavigate} from "react-router-dom";

export const Todolists = () => {

    const dispatch = useAppDispatch()
      const todo=useSelector<RootReducerType,DomainType[]>(state => state.Todolist)
    useEffect(()=>{
        dispatch(getTodoTC())
    }, [])


    return (
        <div className={s.todolistsWrapper}>
            {todo.map(el=>{
                return <Todolist todolistId={el.id} todolistTitle={el.title} key={el.id} filterStatus={el.filter} entityStatus={el.entityStatus}/>
            })}
        </div>
    );
};

