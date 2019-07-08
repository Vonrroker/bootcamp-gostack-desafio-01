const express = require("express");

app = express();
app.use(express.json());

let contador = 0;

const projetos = [{ id: "1", title: "Novo projeto", tasks: [] }];

function logcontador(req, res, next) {
  contador++;
  console.log(`Nº de requisições ${contador}`);
  return next();
}

app.use(logcontador);

function checkIfIdExist(req, res, next) {
  const projeto = projetos.find(element => element.id === req.params.id);
  if (!projeto) {
    return res.status(400).json({ error: "Não existe projeto com esse id" });
  }
  return next();
}

app.get("/projects", (req, res) => {
  return res.json(projetos);
});

app.post("/projects", (req, res) => {
  const { id, title } = req.body;
  projetos.push({ id, title, tasks: [] });
  return res.json(projetos);
});

app.put("/projects/:id", checkIfIdExist, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;
  const projeto = projetos.find(element => element.id === id);
  projeto.title = title;
  return res.json(projetos);
});

app.delete("/projects/:id", checkIfIdExist, (req, res) => {
  const { id } = req.params;
  const index = projetos.findIndex(element => element.id === id);
  projetos.splice(index, 1);
  return res.json(projetos);
});

app.post("/projects/:id/tasks", checkIfIdExist, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;
  const projeto = projetos.find(element => element.id === id);
  projeto.tasks.push(title);
  return res.json(projetos);
});

app.listen(3333);
