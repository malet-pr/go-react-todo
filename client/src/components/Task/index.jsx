import React,{useState} from 'react';
import {Container,Icon,Modal,Header} from 'semantic-ui-react';
import AddTask from '../AddTask';
import './Task.css'

function Task(props) {

    const [modalIsOpen, setIsOpen] = useState(false);
    const [isEdited,setIsEdited] = useState(false);
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [detailsOpen, setDetailsOpen] = useState(false);

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
                <Modal closeIcon open={detailsOpen} trigger={<Icon color='blue' name='eye' style={{float:'right'}}/>}
                        onClose={() => setDetailsOpen(false)} onOpen={() => setDetailsOpen(true)}>
                    <Header icon='tasks' content='Task Details' style={{backgroundColor:'purple'}}/>
                    <Modal.Content>
                        <div><h3>{props.task.title}</h3></div>
                        <div>{props.task.description}</div>
                        <div>{props.task.completed ? "tarea completada" : "tarea por completar"}</div>
                    </Modal.Content>
                    </Modal>
            </Container>
        </div>
    );
}

export default Task;

