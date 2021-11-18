const { request, response } = require('express');
const express = require('express');
const { v4: uuidv4 } = require("uuid");
const { v4: isuuid } = require('uuid');

const app = express();

app.use(express.json());

const projects = [];

function logRequests(request, response, next){
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.log(logLabel);

    return next();

    // console.timeEnd(logLabel);
}
function validateProjectID(request, response, next){
    const { id } = request.params;

    if(!isuuid(id)){
        return response.status(400).json({erro : 'Invalid project ID.'});
    }

    return next();
}

app.use(logRequests);

app.get('/projects/',(request,response)=>{
    const {title} = request.query;
    const result = title
        ? projects.filter(project => project.title.includes(title))
        : projects;
        
    return response.json(result);
});

app.post('/projects/',(request,response)=>{
    const { title , owner } = request.body;
    const project = { id: uuidv4(), title , owner};
    projects.push(project);
    return response.json(project);
});

app.put('/projects/:id', validateProjectID ,(request,response)=>{
    const { id } = request.params;
    const { title ,owner } = request.body;
    const projectIndex = projects.findIndex(project => project.id === id);
    if ( projectIndex < 0){
        return response.status(400).json({ error : 'Project not found.' });
    }
    const project = { id, title, owner, };

    projects[projectIndex] = project;
    
    return response.json(project);
});

app.delete('/projects/:id', validateProjectID ,(request,response)=>{
    const { id } = request.params;
    const projectIndex = projects.findIndex(project => project.id === id);
    if (projectIndex < 0){
        return response.status(400).json({error : "Project not found."});
    }
    projects.splice(projectIndex,1);
    
    return response.status(204).send();
});

app.listen(3333, ()=>{
    console.log("Back-end Started! 🚀")
});