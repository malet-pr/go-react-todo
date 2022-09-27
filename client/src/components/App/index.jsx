import React,{useState,useEffect} from 'react';
import {Header,Icon,Button,Form,Popup} from 'semantic-ui-react';
import TodoList from '../TodoList';
import Task from '../Task';
import AddTask from '../AddTask';
import './App.css';
import {GetAllTasks,RemoveTask,ToggleTask,RemoveAll} from '../../service/apiCalls.js';


function App() {

  const [tasks, setTasks] = useState([]);
  const [searchValue,setSearchValue] = useState('');
  const [newTask,setNewTask] = useState([]);
  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    GetAllTasks().then(setTasks);
  }, []);

  const handleSearchChange = (event) =>{
    console.log (event.target.value)
    setSearchValue(event.target.value)
  }

  let searchTasks = [];
  if (searchValue <= 0) {
    searchTasks = tasks;
  }else {
    searchTasks = tasks.filter(
      task => {
        const taskTitle = task.title.toLowerCase();
        const searchText = searchValue.toLowerCase();
        return taskTitle.includes(searchText);
      }
    );
  }

  const deleteAll = (e) => {
    RemoveAll();
    setTasks([]);
  }

  function openFromParent() {
    setIsOpen(true);
  }

  function handleCloseModal(event, newTask) {
    setIsOpen(false);
    if(newTask != null) addTask(newTask);
  }

  function addTask(newTask) {
    if(tasks != null){
      const task = newTask;
      setTasks([...tasks, task]);
    } else {
      setTasks(newTask);
    }
  }  

  function toggleTaskCompleted(_id) {
    const updatedTasks = tasks.map((task) => {
      if (_id === task._id) {
        ToggleTask(_id);
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

  function editTask(_id, title, description) {
    const editedTaskList = tasks.map((task) => {
      if (_id === task._id) {
        return {_id:task._id, title:title, description:description, completed:task.completed};
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
      <Form>
        <Form.Field>
          <input type='text' placeholder="Search Task" value={searchValue} onChange={handleSearchChange}/>
        </Form.Field>
      </Form>
      <TodoList >
        {searchTasks && searchTasks.map((task, index) => (
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
      <Popup content='Add a new task' trigger={
        <Icon className='task-button' color='green' name='add' size='huge' onClick={openFromParent}/>
      } />
      <Popup content='Delete all tasks' trigger={
        <Icon className='delete-button' color='red' name='delete' size='huge' onClick={deleteAll}/>
      } />
      <AddTask newTask={newTask} title={title} description={description} IsModalOpened={modalIsOpen} onCloseModal={handleCloseModal} />
    </div>
  )
}

export default App
