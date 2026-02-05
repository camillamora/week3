const express = require('express');
const app = express();

app.use(express.json()); // Parse JSON bodies

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
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.json(todo);
});

/* ============================
   POST – Create
   (Validation: "task" required)
   ============================ */
app.post('/todos', (req, res) => {
  const { task, completed } = req.body;

  if (!task) {
    return res.status(400).json({ error: 'Task is required' });
  }

  const newTodo = {
    id: todos.length + 1,
    task,
    completed: completed || false,
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

/* ============================
   PATCH – Update (partial)
   ============================ */
app.patch('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  Object.assign(todo, req.body); // Merge updates
  res.status(200).json(todo);
});

/* ============================
   DELETE – Remove
   ============================ */
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;

  todos = todos.filter(t => t.id !== id);

  if (todos.length === initialLength) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.status(204).send(); // No content
});

/* ============================
   BONUS – GET active todos
   (completed === false)
   ============================ */
app.get('/todos/active', (req, res) => {
  const active = todos.filter(t => !t.completed);
  res.json(active);
});

/* ============================
   ERROR HANDLER
   ============================ */
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});

/* ============================
   START SERVER
   ============================ */
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));