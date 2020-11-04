const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} =  request.body;
  const repo = {
      id: uuid(),
      title, 
      url, 
      techs, 
      likes: 0
  };

  repositories.push(repo);
  response.json(repo)
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} =  request.body;
  if (isUuid(id)){ 
    const repoIndex = repositories.findIndex(repo => repo.id === id);
    if(repoIndex > -1){ 
      const repo = {
        id, 
        title,
        url, 
        techs,
        likes: repositories[repoIndex].likes
      }
      repositories[repoIndex] = repo;
      response.json(repo);

    }
  }else{
    response.status(400).json({error :"Id repository not found"})
  }
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  if(isUuid(id)){
    const indexRepo = repositories.findIndex(repo => repo.id === id);
    if( indexRepo > -1) {
      repositories.splice(indexRepo, 1);
      return response.status(204).send();
    }
  }else{
    response.status(400).json({error: "Id repository not found"})
  }
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  if(isUuid(id)){
    const indexRepo = repositories.findIndex(repo => repo.id === id);
    if(indexRepo > -1 ){
      const repository = repositories[indexRepo]
      repository.likes = repository.likes + 1;
      repositories[indexRepo] = repository;
      response.send(repository);
    }
  }else {
    response.status(400).json({error: "Id repository not found"})
  }
});

module.exports = app;
