const express = require('express');
const connectDatabase = require('./config/db');
const errorMiddleware = require('./middleware/error');
const restrictToThaparNetwork = require('./middleware/networkAccess');
const cors = require('cors');
require('dotenv').config();

// Create Express app
const app = express();

// Connect to database
connectDatabase();

// Middleware
app.use(express.json());
app.use(cors());

// Restrict access to Thapar network
app.use(restrictToThaparNetwork);

// Import routes
const auth = require('./routes/auth');
const department = require('./routes/department');
const course = require('./routes/course');
const experiment = require('./routes/experiment');

// Mount routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/departments', department);
app.use('/api/v1/courses', course);
app.use('/api/v1/experiments', experiment);

// Error handling middleware
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 