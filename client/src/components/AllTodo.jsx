import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styles from "../css/all.module.css";
import { useNavigate } from 'react-router-dom';

const AllTodo = () => {
    const todoUrl = process.env.REACT_APP_SERVER_URL_TODO;
    const nav = useNavigate();

    const [todos, setTodos] = useState([]);
    const [todoStatus, setTodoStatus] = useState(false);

    const [sortType, setSortType] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [filterUser, setFilterUser] = useState('');

    const [showNoteModal, setShowNoteModal] = useState(false);
    const [currentTodoId, setCurrentTodoId] = useState(null);
    const [currentTodoName, setCurrentTodoName] = useState(null);
    const [noteText, setNoteText] = useState("");

    const userOptions = [
        { value: '1', label: 'user1' },
        { value: '2', label: 'user2' },
        { value: '4', label: 'user4' },
        { value: '22', label: 'user22' },
    ];

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = () => {
        setTodoStatus(false);
        axios.get(todoUrl)
            .then((res) => {
                if (res.status === 200 || res.status === 201) {
                    setTodoStatus(true);
                    setTodos(res.data.data);
                }
            })
            .catch(() => {
                setTodoStatus(false);
                setTodos([]);
            });
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this todo?");
        if (!confirmDelete) return;

        try {
            const res = await axios.delete(`${todoUrl}/${id}`);
            if (res.status === 200 || res.status === 204) {
                setTodos(prev => prev.filter(todo => todo.id !== id));
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete todo.");
        }
    };

    const showDetailedTodo = (id) => {
        nav(`/todo/details/${id}`);
    };

    const openNoteModal = (id, name) => {
        setCurrentTodoId(id);
        setCurrentTodoName(name);
        setNoteText('');
        setShowNoteModal(true);
    };

    const handleNoteSubmit = async () => {
        try {
            const res = await axios.patch(`${todoUrl}/note/${currentTodoId}`, {
                notes: noteText
            });
            if (res.status === 200 || res.status === 201) {
                setShowNoteModal(false);
                fetchTodos();
            }
        } catch (err) {
            console.log(err);
            alert("Failed to add note.");
        }
    };

    // Derived filtered/sorted todos
    const filteredTodos = todos
        .filter(todo => {
            if (filterPriority && Number(todo.priority) !== Number(filterPriority)) return false;
            if (filterUser && (!todo.tag_users || !todo.tag_users.split(',').includes(filterUser))) return false;
            return true;
        })
        .sort((a, b) => {
            if (sortType === 'date_new') return new Date(b.created_at) - new Date(a.created_at);
            if (sortType === 'date_old') return new Date(a.created_at) - new Date(b.created_at);
            if (sortType === 'priority_high') return (a.priority ?? 4) - (b.priority ?? 4);
            if (sortType === 'priority_low') return (b.priority ?? 4) - (a.priority ?? 4);
            return 0;
        });

    if (!todoStatus) {
        return <div className={styles.loading}>Loading.....</div>;
    }

    return (
        <div className={styles.todoContainer}>
            <h2 className={styles.heading}>My Todos</h2>
            <a href='/' className={styles.home_btn}>+ Create New</a>

            {/* Controls */}
            <div className={styles.controls}>
                <div className={styles.selectGroup}>
                    <label>Sort by:</label>
                    <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
                        <option value="">None</option>
                        <option value="date_new">Newest First</option>
                        <option value="date_old">Oldest First</option>
                        <option value="priority_high">Priority: High to Low</option>
                        <option value="priority_low">Priority: Low to High</option>
                    </select>
                </div>

                <div className={styles.selectGroup}>
                    <label>Filter by Priority:</label>
                    <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                        <option value="">All</option>
                        <option value="1">High</option>
                        <option value="2">Medium</option>
                        <option value="3">Low</option>
                    </select>
                </div>
                <div className={styles.selectGroup}>
                    <label>Filter by User:</label>
                    <select value={filterUser} onChange={(e) => setFilterUser(e.target.value)}>
                        <option value="">All</option>
                        {userOptions.map((user) => (
                            <option key={user.value} value={user.value}>
                                {user.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Todos List */}
            <div className={styles.container}>
                {filteredTodos.map((todo) => (
                    <div className={styles.todoCard} key={todo.id}>
                        <h3 title="Click for details" onClick={() => showDetailedTodo(todo.id)} className={styles.todoTitle}>
                            {todo.name.toUpperCase()}
                        </h3>

                        <div className={styles.meta}>
                            <span className={styles.priority}>
                                🔥 Priority: {todo.priority === 1 ? 'High' : todo.priority === 2 ? 'Medium' : todo.priority === 3 ? 'Low' : 'None'}
                            </span>
                            <span className={styles.date}>
                                📅 {new Date(todo.created_at).toLocaleDateString()}
                            </span>
                        </div>

                        {todo.tag_users && (
                            <div className={styles.tags}>
                                {todo.tag_users.split(',').map((user, idx) => (
                                    <span key={idx} className={styles.tagChip}>👤 {user}</span>
                                ))}
                            </div>
                        )}


                        <div className={styles.actions}>
                            <a href={`todo/details/${todo.id}`} className={styles.detailsButton}>Details</a>
                            <button className={styles.noteButton} onClick={() => openNoteModal(todo.id, todo.name)}>Note</button>
                            {/* <button className={styles.editButton}>Edit</button> */}
                            <button className={styles.deleteButton} onClick={() => handleDelete(todo.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Note Modal */}
            {showNoteModal && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modalBox}>
                        <h3>Add Note for <i>{currentTodoName.toUpperCase()}</i></h3>
                        <textarea
                            placeholder="Write your note here..."
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                        />
                        <div className={styles.modalActions}>
                            <button onClick={handleNoteSubmit} className={styles.saveNote}>Save</button>
                            <button onClick={() => setShowNoteModal(false)} className={styles.cancelNote}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllTodo;
