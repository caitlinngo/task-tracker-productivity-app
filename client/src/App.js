import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({
    urgency: 'All', completed: 'All', due: 'All',
  });

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

    if (!taskId) {
      console.error("Missing task ID for toggle!");
      return;
    }
    

    try {
      // Update the single task
      await fetch(`http://localhost:5001/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus }),
      });
  
      const res = await fetch('http://localhost:5001/api/tasks');
      const data = await res.json();
      console.log("Fetched tasks after toggle:", data); //debug
  
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        console.error('Expected array, got:', data);
      }
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

  // Apply filters to tasks
  const filteredTasks = tasks.filter((task) => {

    console.log("Checking task:", task);

    const matchUrgency =
      filter.urgency === 'All' || task.urgency === filter.urgency;
    const matchCompleted =
      filter.completed === 'All' ||
      (filter.completed === 'Completed' && task.completed) ||
      (filter.completed === 'Incomplete' && !task.completed);
    const matchDue =
      filter.due === 'All' ||
      (filter.due === 'Has Due Date' && task.dueDate) ||
      (filter.due === 'No Due Date' && !task.dueDate);
    return matchUrgency && matchCompleted && matchDue;
  });

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📝 My Task Tracker</h1>

      <TaskForm onSubmit={handleTaskAdded} />

      {/* Filters */}
      <div style={{ margin: '1rem 0', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }} >
        <label>
          Urgency:
          <select
            value={filter.urgency}
            onChange={(e) => setFilter({ ...filter, urgency: e.target.value })}
            style={{ marginLeft: '0.5rem', padding: '0.3rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
          >
            <option value="All">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label>
          Status:
          <select
            value={filter.completed}
            onChange={(e) => setFilter({ ...filter, completed: e.target.value })}
            style={{ marginLeft: '0.5rem', padding: '0.3rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
          >
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Incomplete">Incomplete</option>
          </select>
        </label>

        <label>
          Due Date:
          <select
            value={filter.due}
            onChange={(e) => setFilter({ ...filter, due: e.target.value })}
            style={{ marginLeft: '0.5rem', padding: '0.3rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
          >
            <option value="All">All</option>
            <option value="Has Due Date">Has Due Date</option>
            <option value="No Due Date">No Due Date</option>
          </select>
        </label>

        <button
          onClick={() =>
            setFilter({ urgency: 'All', completed: 'All', due: 'All' })
          }
          style={{
            padding: '0.4rem 0.8rem', borderRadius: '4px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', fontSize: '1rem', cursor: 'pointer', marginLeft: '1rem' }}
        >
          Clear Filters
        </button>

      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <p>No tasks match the filters</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredTasks.map((task) => (
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
