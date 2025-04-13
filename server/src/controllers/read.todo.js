import { TodoRepository } from "../repo/crud.repo.js";

export class ReadTodo{

    constructor(){
        this.todoRepo = new TodoRepository();
    }

    getAll = async(req,res)=>{
        let resRepo = await this.todoRepo.getAll();
        return res.status(resRepo.status_code).json({
            status:resRepo.status,
            message:resRepo.message,
            error:resRepo.error,
            data:resRepo.data
        })
    }

    getById = async(req,res)=>{
        let {todo_id} = req.params;
        if(!todo_id){
            return res.status(404).json({
                status:false,
                message:'todo_id  is a required parameter!!'
            })
        }

        let resRepo = await this.todoRepo.getTodoById(todo_id);
        
        return res.status(resRepo.status_code).json({
            status:resRepo.status,
            message:resRepo.message,
            data:resRepo.data,
            error:resRepo.error
        })
    }

}