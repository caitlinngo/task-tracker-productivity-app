import React, { useState } from 'react';

const TaskForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [urgency, setUrgency] = useState('medium'); // default value

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const taskData = {
      title,
      dueDate: dueDate || null,
      urgency
    };
  
    try {
      const response = await fetch('http://localhost:5001/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
  
      const savedTask = await response.json(); // ✅ includes _id, completed, etc.
      onSubmit(savedTask); // ✅ use this instead of raw taskData
  
      // Clear form
      setTitle('');
      setDueDate('');
      setUrgency('medium');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        placeholder="Enter a task..."
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
        <option value="low">Low Urgency</option>
        <option value="medium">Medium Urgency</option>
        <option value="high">High Urgency</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
