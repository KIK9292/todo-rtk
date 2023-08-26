import React, {KeyboardEvent,ChangeEvent, useState} from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import  AddBox  from '@mui/icons-material/AddBox';


type AddItemFormPropsType = {
    callback: (title: string) => void
    disabled:boolean
}

export const AddItemForm = (props: AddItemFormPropsType)=>{
    const {callback,disabled}=props
    console.log('AddItemForm called')

    let [title, setTitle] = useState('')
    let [error, setError] = useState<string | null>(null)

    const addItem = () => {
        if (title.trim() !== '') {
            callback(title);
            setTitle('');
        } else {
            setError('Title is required');
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null);
        }
        if (e.charCode === 13) {
            addItem();
        }
    }

    return <div>
        <TextField variant="outlined"
                   error={!!error}
                   value={title}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   label="AddTitle"
                   helperText={error}
                   disabled={disabled}
        />
        <IconButton color="primary" onClick={addItem} disabled={disabled}>
            <AddBox/>
        </IconButton>
    </div>
}
