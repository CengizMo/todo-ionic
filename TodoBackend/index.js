const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000

const todos = [
    {task: "Müll rausbringen", checked: false},
    {task: "Putzen", checked: false},
    {task: "Beim Arzt anrufen", checked: false}
]

app.use(cors(), express.json())

app.get('/todos', (req, res) => {
  res.send(todos)
})

app.post('/todos', (req, res) => {
    todos.unshift({task: req.body.task, checked: false});
    res.status(201).end()
})

app.put('/todos/todo/:id', (req, res) => {
    const id = req.params.id;
    const task = req.body.task;
    todos[id].task = task;

    res.status(200).end();

})

app.put('/todos/todo/check/:id', (req, res) => {
    const id = req.params.id;
    todos[id].checked = req.body.checked;
    const tempTodo = todos[id];
    todos.splice(id, 1);

    if(req.body.checked)
    {
        todos.push(tempTodo);
    }
    else
    {
        todos.unshift(tempTodo);
    }

    res.status(200).end()
})

app.delete('/todos/todo/:id', (req, res) => {
    const id = req.params.id;
    todos.splice(id, 1);
    
    res.status(200).end();
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})