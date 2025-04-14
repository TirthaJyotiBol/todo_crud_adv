import React from 'react';
import CreateTodo from '../components/CreateTodo.jsx';
import home_css from "../css/home.module.css";

const Home = () => {
    return (
        <div className={`${home_css.home_page}`} >
            <CreateTodo/>
            <a href='/todos' className={home_css.todo_btn}>GET ALL</a>
        </div>
    );
}

export default Home;