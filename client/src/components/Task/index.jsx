import React,{useState} from 'react';
import {Container,Icon} from 'semantic-ui-react';
import AddTask from '../AddTask';
import './Task.css'

function Task(props) {

    const [modalIsOpen, setIsOpen] = useState(false);
    const [isEdited,setIsEdited] = useState(false);
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");

    const openFromTask = () => {
        setIsEdited(true);
        setIsOpen(true);  
    }

    function handleCloseModal(event, title, description) {
        setIsOpen(false);
        if(title != null) 
        props.editTask(props.task._id,title,description)
    }

    return (
        <div >
            <Container>
                <div className='completed' style={ { textDecorationLine:props.task.completed ? "line-through": ""}}>
                    {props.task.title} 
                </div>
                <div style={{float:'right'}}>
                    <Icon color='green' name='check' onClick={() => props.toggleTaskCompleted(props.task._id)}/>
                    <Icon color='red' name='delete' onClick={() => props.deleteTask(props.task._id)}/>
                    <Icon color='yellow' name='edit' onClick={openFromTask}/>
                </div>
                <AddTask task={props.task} isEdited={isEdited} IsModalOpened={modalIsOpen} onCloseModal={handleCloseModal} />
            </Container>
        </div>
    );
}

export default Task;

