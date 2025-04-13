import { createDbConnection } from "../database/db.conn.js";

export class TodoRepository{
    #todo_table = 'todos';
    #db_conn;

    constructor() {
        createDbConnection().then(conn => {this.#db_conn = conn;}).catch(err => {console.log("Failed to connect to DB:", err);});
    }

    getAll = async()=>{
        try{
            let query = `SELECT * FROM ${this.#todo_table} `;
            let res = await this.#db_conn.query(query);
            let data = res[0];
            return {
                status: true,
                status_code: 201,
                message: 'Data Fetched',
                error: null,
                data:data.length>0?data:[]
            };
        }
        catch(err){
            return {
                status: false,
                status_code: 500,
                message: 'Internal server error',
                error: err,
                data:[]
            };
        }
    }

    createTodo =async(todoObj)=>{
        let { name, priority, user, desc } = todoObj;

        try {
            let columns = ['name', 'description'];
            let values = [name, desc];
            let placeholders = ['?', '?'];
        
            if (priority) {
                columns.push('priority');
                values.push(priority);
                placeholders.push('?');
            }
        
            if (user) {
                columns.push('tag_users');
                values.push(user);
                placeholders.push('?');
            }
        
            const query = `INSERT INTO ${this.#todo_table} (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;
            const result = await this.#db_conn.query(query, values);
            return {
                status: true,
                status_code: 200,
                message: 'Todo inserted successfully',
                data: result
            };
        } catch (err) {
            return {
                status: false,
                status_code: 500,
                message: 'Internal server error',
                error: err
            };
        }
        

    }

    getTodoById = async(id)=>{
        try{
            let query = `SELECT * FROM ${this.#todo_table} WHERE id = ? `;
            let res = await this.#db_conn.query(query,[id]);
            let data = res[0];
            return {
                status: true,
                status_code: 201,
                message: 'Data Fetched',
                error: null,
                data:data.length>0?data:[]
            };
        }
        catch(err){
            return {
                status: false,
                status_code: 500,
                message: 'Internal server error',
                error: err,
                data:[]
            };
        }
    }


    deleteTodo = async (id)=>{
        try{
            let query = `DELETE FROM ${this.#todo_table} WHERE id = ? `;
            await this.#db_conn.query(query,[id]);
            return {
                status: true,
                status_code: 200,
                message: 'Data deleted',
                error: null,
            };
        }
        catch(err){
            return {
                status: false,
                status_code: 500,
                message: 'Internal server error',
                error: err,
            };
        }
    }

    addNote = async (id, newNote) => {
        try {
            const [rows] = await this.#db_conn.query(`SELECT notes FROM ${this.#todo_table} WHERE id = ?`, [id]);
            if (rows.length === 0) {
                return {
                    status: false,
                    status_code: 404,
                    message: 'Todo not found',
                    error: null
                };
            }
    
            let existingNote = rows[0].notes;
            let updatedNote;
    
            if (existingNote && existingNote.trim().length > 0) {
                updatedNote = `${existingNote}, ${newNote}`;
            } else {
                updatedNote = newNote;
            }
    
            const query = `UPDATE ${this.#todo_table} SET notes = ? WHERE id = ?`;
            await this.#db_conn.query(query, [updatedNote, id]);
    
            return {
                status: true,
                status_code: 201,
                message: 'Note added successfully',
                error: null,
            };
        } catch (err) {
            return {
                status: false,
                status_code: 500,
                message: 'Internal server error',
                error: err,
            };
        }
    };


    async updateTodo(todo_id, updatedTodoObj) {
        const { name, description, tag_users, priority, notes } = updatedTodoObj;

        try {
            const query = `
                UPDATE todos 
                SET name = ?, description = ?, tag_users = ?, priority = ?, notes = ? 
                WHERE id = ?;
            `;

            const [result] = await this.#db_conn.query(query, [name, description, tag_users, priority, notes, todo_id]);

            if (result.affectedRows === 0) {
                return {
                    status_code: 404,
                    status: false,
                    message: 'Todo not found or could not be updated',
                    error: null
                };
            }

            return {
                status_code: 200,
                status: true,
                message: 'Todo updated successfully',
                error: null
            };
        } catch (error) {
            console.error('Error updating todo in DB:', error);
            return {
                status_code: 500,
                status: false,
                message: 'Internal Server Error',
                error: error.message
            };
        }
    }
    

}