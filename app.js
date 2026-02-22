const express = require('express');
const cors = require('cors');
const logRequest = require("./logger.js");
const validateTodo = require("./validator.js");
const errorHandler = require("./errorHandler.js");
const validatePartialTodo = require("./validatorPatch.js");

const app = express();


app.use(express.json()); // Parse JSON bodies

const corsOptions = {
  origin : 'http://localhost:5173',
};

app.use(cors(corsOptions));

app.use(logRequest);

// In‑memory todos
let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

/* ============================
   GET ALL – Read
   ============================ */
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

/* ============================
   GET ONE – Read by ID
   ============================ */
app.get('/todos/:id', (req, res, next) => {
  try{
    const id = parseInt(req.params.id);
  if(isNaN(id)){
    throw new Error("Invalid ID")
  }

    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo);
  } catch(error){
    next(error);
  }
});

/* ============================
   POST – Create
   (Validation: "task" required)
   ============================ */
app.post('/todos', validateTodo, (req, res, next) => {
  try{
    const { task, completed } = req.body;

    const newTodo = {
      id: todos.length + 1,
      task,
      completed: completed || false,
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
});

/* ============================
   PATCH – Update (partial)
   ============================ */
app.patch('/todos/:id', validatePartialTodo, (req, res, next) => {
  try{
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    Object.assign(todo, req.body); // Merge updates
    res.status(200).json(todo);
  } catch(error){
    next(error);
  }
});

/* ============================
   DELETE – Remove
   ============================ */
app.delete('/todos/:id', (req, res, next) => {
  try{
    const id = parseInt(req.params.id);
    const initialLength = todos.length;

    todos = todos.filter(t => t.id !== id);

    if (todos.length === initialLength) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(204).send(); // No content
  } catch(error){
    next(error);
  }
});

/* ============================
   BONUS – GET active todos
   (completed === false)
   ============================ */
app.get('/todos/active', (req, res, next) => {
  try{
    const active = todos.filter(t => !t.completed);
    res.json(active);
  } catch(error){
    next(error);
  }
});

/* ============================
   ERROR HANDLER
   ============================ */
app.use(errorHandler);

/* ============================
   START SERVER
   ============================ */
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));