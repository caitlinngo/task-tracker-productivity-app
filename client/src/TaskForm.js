import React, { useState } from 'react';

function TaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState('');
  //const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!title.trim()) return; // prevent empty tasks
  
    try {
      const response = await fetch('http://localhost:5001/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
  
      const newTask = await response.json();
      onTaskAdded(newTask); // update task list in App.js

      //clear form fields
      setTitle('');
      setDueDate('');
    } catch (err) {
      console.error('Error submitting task:', err);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <label>
        Task:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ marginLeft: '0.5rem', marginRight: '1rem' }}
        />
      </label>
  
      <label>
        Due Date (optional):
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ marginLeft: '0.5rem', marginRight: '1rem' }}
        />
      </label>
  
      <button
        type="submit"
        style={{
          padding: '0.3rem 0.8rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Add Task
      </button>
    </form>
  );
  
}

export default TaskForm;
