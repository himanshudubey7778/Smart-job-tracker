const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const jobRoutes = require('./routes/jobRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/jobs', jobRoutes);

app.get('/', (req, res) => {
  res.send('Smart Job Tracker API is running...');
});

// Database Connection & Server Listen
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log('DB Connection Error:', err));