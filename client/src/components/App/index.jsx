import React,{useState,useEffect} from 'react';
import {Header,Icon} from 'semantic-ui-react';
import axios from 'axios'
import TodoList from '../TodoList';
import Task from '../Task';
import AddTask from '../AddTask';
import './App.css';

const baseUrl = "http://localhost:9000/tasks";

function App() {

    /*const [tasks, setTasks] = useState([]);
    axios(baseUrl).then(response =>setTasks(response.data)); */

  const [tasks, setTasks] = useState([
    {'id': 1,
    'title': 'Work',
    'description':'lo que sea',
    'completed': true},
    {'id': 2,
    'title': 'Study',
    'description':'lo que sea',
    'completed':true},
    {'id': 3,
    'title': 'Watch TV',
    'description':'lo que sea',
    'completed':false},
  ]);

  const [newTask,setNewTask] = useState([]);
  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  const [modalIsOpen, setIsOpen] = useState(false);

  function openFromParent() {
    setIsOpen(true);
  }

  function handleCloseModal(event, newTask) {
    setIsOpen(false);
    if(newTask != null) addTask(newTask);
  }

  function addTask(newTask) {
    const task = newTask;
    setTasks([...tasks, task]);
  }  

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return {...task, completed: !task.completed}
      }
      return task;
    });
    setTasks(updatedTasks);
  }
  
  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  } 

  function editTask(id, title, description) {
    const editedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return {id:task.id, title:title, description:description, completed:false};
      }
      return task;
    });
    setTasks(editedTaskList);
  }
 
  return (
    <div className='root'>
      <Header className='header' as='h1'>
        Things To Do
      </Header> 
      <TodoList >
        {tasks.map((task, index) => (
          <Task
              task={task}
              index={index}
              key={index}
              toggleTaskCompleted={toggleTaskCompleted}
              deleteTask={deleteTask}
              editTask={editTask}
          />
        ))}
      </TodoList>
      <Icon className='task-button' color='purple' name='add circle' size='huge' onClick={openFromParent}/>
      <AddTask newTask={newTask} title={title} description={description}
                IsModalOpened={modalIsOpen} onCloseModal={handleCloseModal} />
    </div>
  )
}

export default App
