import React, { useState } from 'react';
import axios from "axios";
import todo_module from "../css/todo.module.css";
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const CreateTodo = () => {
    const [todoData, setTodoData] = useState({});
    const [taggedUsers, setTaggedUsers] = useState([]);
    const todoUrl = process.env.REACT_APP_SERVER_URL_TODO;
    const nav = useNavigate();

    const userOptions = [
        { value: '1', label: 'user1' },
        { value: '2', label: 'user2' },
        { value: '4', label: 'user4' },
        { value: '22', label: 'user22' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!todoData.name) {
            alert('Todo is a required field');
            return;
        }

        if (!todoData.desc) {
            alert('Description is a required field');
            return;
        }

        const finalPayload = {
            ...todoData,
            user: taggedUsers.map(u => u.value).join(',')
        };

        axios.post(todoUrl, finalPayload).then((res) => {
            if (res.status === 200 && res.data.status === true) {
                nav('/todos');
            }
        }).catch((err) => {
            console.log(err);
            alert('Server error, todo cannot be created');
        });
    };

    return (
        <div className={todo_module.todo_form}>
            <h2>Add Todo</h2>

            <div className={todo_module.todo_div}>
                <label htmlFor='todo_input'>Enter Todo</label>
                <input
                    value={todoData.name ?? ''}
                    onChange={(e) => setTodoData({ ...todoData, 'name': e.target.value })}
                    id='todo_input'
                    placeholder='Enter Todo'
                />
            </div>

            <div className={todo_module.todo_div}>
                <label htmlFor='priority_select'>Priority</label>
                <select
                    value={todoData.priority ?? ''}
                    id='priority_select'
                    onChange={(e) => setTodoData({ ...todoData, 'priority': e.target.value })}
                >
                    <option value=''>Select Priority</option>
                    <option value='1'>High</option>
                    <option value='2'>Medium</option>
                    <option value='3'>Low</option>
                </select>
            </div>

            <div className={todo_module.todo_div}>
                <label>Tag Users</label>
                <Select
                    options={userOptions}
                    isMulti
                    value={taggedUsers}
                    onChange={(selected) => setTaggedUsers(selected)}
                    className={todo_module.react_select}
                    placeholder="Select users..."
                />
            </div>

            <div className={todo_module.todo_div}>
                <label htmlFor='todo_note'>Description</label>
                <textarea
                    id='todo_note'
                    placeholder='Add a Note'
                    value={todoData.desc ?? ''}
                    onChange={(e) => setTodoData({ ...todoData, 'desc': e.target.value })}
                />
            </div>

            <button type="submit" onClick={handleSubmit} className={todo_module.submit_button}>
                Create Todo
            </button>
        </div>
    );
};

export default CreateTodo;
