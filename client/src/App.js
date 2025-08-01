import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';

function App() {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks on load
  useEffect(() => {
    fetch('http://localhost:5001/api/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error('Error fetching tasks:', err));
  }, []);

  // Add task (callback from TaskForm)
  const handleTaskAdded = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
  };

  // Toggle complete
  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      const res = await fetch(`http://localhost:5001/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus }),
      });
      const updatedTask = await res.json();
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? updatedTask : task))
      );
    } catch (err) {
      console.error('Error toggling completion:', err);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:5001/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  // Update title
  const handleUpdateTitle = async (taskId, newTitle) => {
    try {
      const res = await fetch(`http://localhost:5001/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });
      const updatedTask = await res.json();
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? updatedTask : task))
      );
    } catch (err) {
      console.error('Error updating title:', err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📝 My Task Tracker</h1>
      <TaskForm onTaskAdded={handleTaskAdded} />
      {tasks.length === 0 ? (
        <p>No tasks yet</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggle={handleToggleComplete}
              onDelete={handleDeleteTask}
              onUpdateTitle={handleUpdateTitle}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
