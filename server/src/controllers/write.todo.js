import { TodoRepository } from "../repo/crud.repo.js";

export class WriteTodo{

    constructor(){
        this.todoRepo = new TodoRepository();
    }

    create =  async (req,res)=>{

        let{name,priority,user,desc} = req.body;
        if(!name || !desc){
            return res.status(404).json({
                status:false,
                message:'name and desc are required fields!!'
            })
        }
        let todoObj = {name,priority,user,desc};

        let resRepo = await this.todoRepo.createTodo(todoObj);
        return res.status(resRepo.status_code).json({
            status:resRepo.status,
            message:resRepo.message,
            error:resRepo.error
        })


    }

    delete = async(req,res)=>{
        let {todo_id} = req.params;
        if(!todo_id){
            return res.status(404).json({
                status:false,
                message:'todo_id  is a required parameter!!'
            })
        }

        const check  = await this.todoRepo.getTodoById(todo_id);
        if(check.status==false || check.data.length<1){
            return res.status(404).json({
                status:false,
                message:'Todo Data not found!!'
            })
        }

        let resRepo = await this.todoRepo.deleteTodo(todo_id);
        return res.status(resRepo.status_code).json({
            status:resRepo.status,
            message:resRepo.message,
            error:resRepo.error
        })

    }

    addNote = async(req,res)=>{
        let {todo_id} = req.params;
        let note = req.body.notes;
        if(!todo_id){
            return res.status(404).json({
                status:false,
                message:'todo_id  is a required parameter!!'
            })
        }
        if(!note){
            return res.status(404).json({
                status:false,
                message:'notes  is a required field!!'
            })
        }

        const check  = await this.todoRepo.getTodoById(todo_id);
        if(check.status==false || check.data.length<1){
            return res.status(404).json({
                status:false,
                message:'Todo Data not found!!'
            })
        }

        let resRepo = await this.todoRepo.addNote(todo_id,note);
        return res.status(resRepo.status_code).json({
            status:resRepo.status,
            message:resRepo.message,
            error:resRepo.error
        })

    }

    updateTodo = async (req, res) => {
        let { todo_id } = req.params;
        let { name, description, tag_users, priority, notes } = req.body;

        if (!todo_id) {
            return res.status(404).json({
                status: false,
                message: 'todo_id is a required parameter!!'
            });
        }

        if (!name || !description) {
            return res.status(404).json({
                status: false,
                message: 'Name and description are required fields!!'
            });
        }

        const check = await this.todoRepo.getTodoById(todo_id);
        if (check.status == false || check.data.length < 1) {
            return res.status(404).json({
                status: false,
                message: 'Todo Data not found!!'
            });
        }

        let updatedTodoObj = { name, description, tag_users, priority, notes };

        let resRepo = await this.todoRepo.updateTodo(todo_id, updatedTodoObj);
        return res.status(resRepo.status_code).json({
            status: resRepo.status,
            message: resRepo.message,
            error: resRepo.error
        });
    }

}