import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Select from 'react-select'; // Import react-select
import styles from "../css/details.module.css";

// User options for the multi-select dropdown
const userOptions = [
    { value: '1', label: 'user1' },
    { value: '2', label: 'user2' },
    { value: '4', label: 'user4' },
    { value: '22', label: 'user22' },
];

const TodoDetails = () => {
    const { id } = useParams();
    const todoUrl = process.env.REACT_APP_SERVER_URL_TODO;
    const [todo, setTodo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTodo, setEditedTodo] = useState({
        name: "",
        description: "",
        priority: 1,
        tag_users: [], // Initialize with empty array for multi-select
        notes: "",
    });

    useEffect(() => {
        fetch(`${todoUrl}/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.status && data.data.length > 0) {
                    setTodo(data.data[0]);
                    setEditedTodo({
                        name: data.data[0].name,
                        description: data.data[0].description,
                        priority: data.data[0].priority,
                        tag_users: data.data[0].tag_users.split(',').map(user => ({ value: user, label: `user${user}` })), // Convert the string to the format required by react-select
                        notes: data.data[0].notes || "",
                    });
                } else {
                    setTodo(null);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching todo:", err);
                setLoading(false);
            });
    }, [id, todoUrl]);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedTodo(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleMultiSelectChange = (selectedUsers) => {
        setEditedTodo(prevState => ({
            ...prevState,
            tag_users: selectedUsers || [],
        }));
    };

    const handleSaveChanges = () => {
        const updatedTodo = { ...editedTodo, tag_users: editedTodo.tag_users.map(user => user.value).join(',') };

        fetch(`${todoUrl}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTodo),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status) {
                    setTodo(updatedTodo);
                    setIsEditing(false);
                    alert("Todo updated successfully!");
                    window.location.reload();
                    
                } else {
                    alert("Failed to update todo.");
                }
            })
            .catch((err) => {
                console.error("Error updating todo:", err);
                alert("Error updating todo.");
            });
    };

    if (loading) {
        return <div className={styles.loading}>Loading todo details...</div>;
    }

    if (!todo) {
        return <div className={styles.loading}>Todo not found!</div>;
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.card}>
                <h1 className={styles.title}>{todo.name.toUpperCase()}</h1>

                {/* Edit Mode Form */}
                {isEditing ? (
                    <div className={styles.editForm}>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={editedTodo.name}
                            onChange={handleEditChange}
                        />
                        <label>Description:</label>
                        <textarea
                            name="description"
                            value={editedTodo.description}
                            onChange={handleEditChange}
                        />
                        <label>Priority:</label>
                        <select
                            name="priority"
                            value={editedTodo.priority}
                            onChange={handleEditChange}
                        >
                            <option value="1">High</option>
                            <option value="2">Medium</option>
                            <option value="3">Low</option>
                        </select>

                        <label>Tag Users:</label>
                        <Select
                            isMulti
                            name="tag_users"
                            options={userOptions}
                            value={editedTodo.tag_users}
                            onChange={handleMultiSelectChange}
                            getOptionLabel={(e) => `👤 ${e.label}`}
                            getOptionValue={(e) => e.value}
                            placeholder="Select users"
                        />

                        <label>Notes:</label>
                        <textarea
                            name="notes"
                            value={editedTodo.notes}
                            onChange={handleEditChange}
                            placeholder="Add notes here..."
                        />

                        <div className={styles.actions}>
                            <button className={styles.saveButton} onClick={handleSaveChanges}>Save</button>
                            <button className={styles.cancelButton} onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className={styles.description}>{todo.description}</p>

                        <div className={styles.infoGroup}>
                            <div className={styles.infoItem}>
                                <strong>Priority:</strong>{" "}
                                <span className={styles[`priority${todo.priority}`]}>
                                    {todo.priority === 1 ? "High" : todo.priority === 2 ? "Medium" : todo.priority === 3 ? "Low" : "None"}
                                </span>
                            </div>

                            <div className={styles.infoItem}>
                                <strong>Created:</strong>{" "}
                                {new Date(todo.created_at).toLocaleString()}
                            </div>
                        </div>

                        {todo.tag_users && (
                            <div className={styles.tagContainer}>
                                <strong>Tagged Users:</strong>
                                <div className={styles.tags}>
                                    {todo.tag_users.split(',').map((user, idx) => (
                                        <span key={idx} className={styles.tag}>👤 User {user}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {todo.notes && (
                            <div className={styles.notesBox}>
                                <strong>Notes:</strong>
                                <ul className={styles.noteList}>
                                    {todo.notes.split(',').map((note, idx) => (
                                        <li key={idx}>{note.trim()}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className={styles.actions}>
                            <button onClick={() => setIsEditing(true)} className={styles.editButton}>Edit</button>
                            <Link to="/todos" className={styles.backButton}>All Todos</Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TodoDetails;
