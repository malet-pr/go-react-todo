import axios from 'axios';

let baseUrl = "http://localhost:9000/api/v1/tasks";
let getAllTasks = "/find-all";
let createTask = "/add-task";
let removeTask = "/delete-task/";
let toggleTask = "/toggle-task/";
let getById = "/find-by-id/";
let findByTitle = "/find-by-title/";
let changeTask = "/edit-task/";
let removeAll = "/delete-all";


async function GetAllTasks() {
    const response = await axios.get(baseUrl+getAllTasks);
    const list = await response.data;
    return list;
}

async function CreateTask(body) {
    const response = await axios.post(baseUrl+createTask,body);
}

async function RemoveTask(id){
    const response = await axios.delete(baseUrl+removeTask+id);
}

async function ToggleTask(id){
    const response = await axios.put(baseUrl+toggleTask+id);
}

async function GetById(id){
    const response = await axios.get(baseUrl+getById+id);
    const one = await response.data;
    return one;
}

async function FindByTitle(string){
    const response = await axios.get(baseUrl+findByTitle+string);
    const list = await response.data;
    return list;
}

async function ChangeTask(id,body){
    const response = await axios.patch(baseUrl+changeTask+id,body);
}
 
async function RemoveAll(){
    const response = await axios.delete(baseUrl+removeAll);
}


export {GetAllTasks,CreateTask,RemoveTask,ToggleTask,GetById,FindByTitle,ChangeTask,RemoveAll}
