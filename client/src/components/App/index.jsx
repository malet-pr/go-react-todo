import React,{useState,useEffect} from 'react';
import {Header,Icon} from 'semantic-ui-react';
import TodoList from '../TodoList';
import Task from '../Task';
import AddTask from '../AddTask';
import './App.css';
import {GetAllTasks,RemoveTask,FinishTask,UndoTask} from '../../service/apiCalls.js';


function App() {

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    GetAllTasks().then(setTasks);
  }, []);

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

  function toggleTaskCompleted(_id) {
    const updatedTasks = tasks.map((task) => {
      if (_id === task._id) {
        if(task.completed){
          UndoTask(task._id);
        } else {
          FinishTask(task._id);
        }
        return {...task, completed: !task.completed}
      }
      return task;
    });
    setTasks(updatedTasks);
  }
  
  function deleteTask(_id) {
    RemoveTask(_id);
    const remainingTasks = tasks.filter((t) => _id !== t._id);
    setTasks(remainingTasks);
  } 

  function editTask(id, title, description) {
    const editedTaskList = tasks.map((task) => {
      if (id === task._id) {
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
