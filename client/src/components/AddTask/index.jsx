import React,{useState} from 'react'
import {Form,Button,Icon} from 'semantic-ui-react';
import Modal from 'react-modal';
import './AddTask.css';
import {CreateTask,ChangeTask} from '../../service/apiCalls.js';

Modal.setAppElement('#root');

function AddTask(props) {
    const [task,setTask] = useState([]);
    let title = '';
    let description = '';
    let oldTitle = props.task!=null?props.task.title:title;
    let oldDescription = props.task!=null?props.task.description:description;


    function onModalClose(event) {
      if(title == '' && !props.isEdited) {
        description = '';
        props.onCloseModal(event,null)
        return;
      }
      if (!props.isEdited ){
        let newTask={'title': title,'description':description,'completed': false};
        CreateTask(newTask);
        title = '';
        description = '';
        props.onCloseModal(event, newTask);
      } else {
        if(title == '') {title=oldTitle};
        if(description == '') {description = oldDescription};
        let changedTask = {'_id':props.task._id,'title': title,'description':description,'completed': props.task.completed};
        ChangeTask(changedTask._id,changedTask);
        props.onCloseModal(event, title,description);
      }
    }

    const handleTitleChange = e => {
      title = e.target.value;
    }
    const handleDescriptionChange = e => {
      description = e.target.value;
    } 

    return (  
      <Modal isOpen={props.IsModalOpened}   
            style={{
              overlay: {
                position: 'fixed', top: "14%", left: "15%", right: "15%", bottom: "14%",
                backgroundColor: 'purple'
              }, content:{background : 'violet'}}}
          >
          <Form onSubmit={onModalClose}>
            <Form.Field className='modal'>
                <label>Task</label>
                <input type='text' placeholder='Task Title' defaultValue={props.task!=null?props.task.title:title} onChange={handleTitleChange}/>
            </Form.Field>
            <Form.Field className='modal'>
                <label>Description</label>
                <textarea placeholder='Task Description' defaultValue={props.task!=null?props.task.description:description} onChange={handleDescriptionChange} />
            </Form.Field>
            <Button.Group className='right floated'>
                <Button type='button' onClick={onModalClose}>
                    <Icon name='remove' color='red' /> Discard
                </Button>
                <Button.Or />
                <Button type='submit' >
                    <Icon name='checkmark' color='green' /> {props.isEdited?'Edit Task':'Add Task'}
                </Button>
            </Button.Group>
          </Form>
      </Modal>
    );
}

export default AddTask;