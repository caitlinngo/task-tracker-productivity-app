const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST new task
router.post('/', async (req, res) => {
  try {
    const { title, dueDate, urgency } = req.body;
    const newTask = new Task({
      title,
      urgency,
      completed: false,
      dueDate: dueDate || null, // optional
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT update task (title, completion, or dueDate)
router.put('/:id', async (req, res) => {
  try {
    const updatedFields = {};

    if (req.body.title !== undefined) {
      updatedFields.title = req.body.title;
    }

    if (req.body.completed !== undefined) {
      updatedFields.completed = req.body.completed;
    }

    if (req.body.dueDate !== undefined) {
      updatedFields.dueDate = req.body.dueDate;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send(); // No content
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
