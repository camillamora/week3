require('dotenv').config();

const express = require('express');
const cors = require('cors');
const logRequest = require("./logger.js");
const validateTodo = require("./validator.js");
const errorHandler = require("./errorHandler.js");
const validatePartialTodo = require("./validatorPatch.js");
const connectDB = require('./database/db.js');
const Todo = require("./models/todo.models.js");
const app = express();

app.use(express.json()); // Parse JSON bodies

const corsOptions = {
  origin : 'http://localhost:5173',
};

app.use(cors(corsOptions));

connectDB();


app.use(logRequest);



/* ============================
   GET ALL – Read
   ============================ */
app.get('/todos', async (req, res) => {
  const todos = await Todo.find({});
  res.status(200).json(todos);
});

/* ============================
   GET ONE – Read by ID
   ============================ */
app.get('/todos/:id', async (req, res, next) => {
  try{
    

    const todo = await Todo.findById(req.params.id);

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
app.post('/todos', validateTodo, async (req, res, next) => {
  const {task, completed} = req.body;
  const newTodo = new Todo({
    task,
    completed
  });
  
  await newTodo.save();
  try{
    res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
});

/* ============================
   PATCH – Update (partial)
   ============================ */
app.patch('/todos/:id', async (req, res, next) => {
  try{
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body , {
      new: true
    })
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
      res.status(404).json({ error: 'Todo not found' });
    
    res.status(200).json(todo);
  } catch(error){
    next(error);
  }
});

/* ============================
   DELETE – Remove
   ============================ */
app.delete('/todos/:id', async (req, res, next) => {
  try{ 
    const todo = await Todo.findByIdAndDelete(req.params.id)
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(200).json({message: `Todo ${req.params.id} deleted`});
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


// GET COMPLETED TASKS
app.get('/todos/completed', async (req, res, next) =>{
  try{
    const completed= await Todo.find({completed: true})
    res.json(completed);
  }catch(error){
    next(error);
  }
})

/* ============================
   ERROR HANDLER
   ============================ */
app.use(errorHandler);

/* ============================
   START SERVER
   ============================ */
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));