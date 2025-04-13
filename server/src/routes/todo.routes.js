import express from "express";
import { WriteTodo } from "../controllers/write.todo.js";
import { ReadTodo } from "../controllers/read.todo.js";

const todoRouter = express.Router();
let writeController = new WriteTodo();
let readController = new ReadTodo();

// get all todos
todoRouter.get('/',(req,res)=>{
    readController.getAll(req,res);
})

todoRouter.get('/:todo_id',(req,res)=>{
    readController.getById(req,res);
});

todoRouter.patch('/:todo_id',(req,res)=>{
    writeController.updateTodo(req,res);
});

todoRouter.patch('/note/:todo_id',(req,res)=>{
    writeController.addNote(req,res);
});


// create todo
todoRouter.post('/',(req,res)=>{
    writeController.create(req,res);
})

todoRouter.delete('/:todo_id',(req,res)=>{
    writeController.delete(req,res);
})

export default todoRouter;