import axios from 'axios';

let baseUrl = "http://localhost:9000";

const allTasks = axios(baseUrl).then(tasks =>{console.log(tasks);});