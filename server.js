<<<<<<< HEAD
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const jobRoutes = require('./routes/jobRoutes');
=======
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const jobRoutes = require("./routes/jobRoutes");
const aiRoutes = require("./routes/aiRoutes");
>>>>>>> 49f5ba01f1cbb2b01afe706a3f7b8dcd9a68b354

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
<<<<<<< HEAD
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
=======
app.use("/api/jobs", jobRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("CareerPulse Pro Backend is running...");
});

// Database & Server Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/smart_job_tracker";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Failed:", err.message);
  });
>>>>>>> 49f5ba01f1cbb2b01afe706a3f7b8dcd9a68b354
