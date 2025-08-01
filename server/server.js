// TO RUN: npm start
// import packages and load .env variables
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); 

// initialize app and port
const app = express();
const PORT = process.env.PORT || 5001;

// middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests

//console.log('Connecting to MongoDB URI:', process.env.MONGODB_URI);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);

// test route (OPTIONAL)
app.get('/', (req, res) => {
  res.send('Backend and DB are running!');
});

// start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});