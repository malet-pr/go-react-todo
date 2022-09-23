import React,{useState} from 'react';
import './TodoList.css';


function TodoList(props) {

    const newTask = (title,completed) => {
        const newTasks = [...props.children, { title, completed }];
        setTasks(newTasks);
    };

    return (
        <div className='block'>
            <div>
                {props.children}
            </div>
        </div>
    );
}

export default TodoList;


