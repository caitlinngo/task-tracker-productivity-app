import React, { useState } from 'react';

function TaskItem({ task, onToggle, onDelete, onUpdateTitle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleUpdateTitle = (id) => {
    const trimmed = editedTitle.trim();
    if (trimmed && trimmed !== task.title) {
      onUpdateTitle(id, trimmed);
    }
    setIsEditing(false);
  };

  // Color for urgency levels
  const urgencyColor = {
    low: 'green',
    medium: 'orange',
    high: 'red',
  };

  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        padding: '0.5rem',
        border: '1px solid #ccc',
        borderRadius: '6px',
      }}
    >
      {/* Checkbox + title */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => {
          console.log("Checkbox clicked:", task); // Debug
          if (!task._id) {
            console.error("Missing _id in task!");
            return;
          }
          onToggle(task._id, task.completed);
        }}
      />


        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            autoFocus
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={() => handleUpdateTitle(task._id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleUpdateTitle(task._id);
            }}
            style={{
              flexGrow: 1,
              padding: '0.3rem',
              fontSize: '1rem',
            }}
          />
        ) : (
          <strong
            onClick={() => {
              setIsEditing(true);
              setEditedTitle(task.title);
            }}
            style={{
              flexGrow: 1,
              cursor: 'pointer',
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? '#888' : '#000',
            }}
          >
            {task.title}
          </strong>
        )}
      </div>

      {/* Due date display */}
      {task.dueDate && (
        <div style={{ marginRight: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}

      {/* Urgency display */}
      {task.urgency && (
        <div
          style={{
            marginRight: '1rem',
            fontWeight: 'bold',
            color: urgencyColor[task.urgency] || 'gray',
            fontSize: '0.9rem',
          }}
        >
          [{task.urgency.toUpperCase()}]
        </div>
      )}

      {/* Delete button */}
      <button
        onClick={() => onDelete(task._id)}
        style={{
          backgroundColor: '#ff4d4f',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '0.3rem 0.7rem',
          cursor: 'pointer',
        }}
      >
        Delete
      </button>
    </li>
  );
}

export default TaskItem;
