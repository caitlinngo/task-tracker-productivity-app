// 1. Import packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Load .env variables

// 2. Initialize app and port
const app = express();
const PORT = process.env.PORT || 5001;

// 3. Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests

// 4. MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// 5. Test route
app.get('/', (req, res) => {
  res.send('Backend and DB are running!');
});

// 6. Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
