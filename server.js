const express = require('express');
const connectDatabase = require('./config/db');
const errorMiddleware = require('./middleware/error');
const restrictToThaparNetwork = require('./middleware/networkAccess');
require('dotenv').config();

// Create Express app
const app = express();

// Connect to database
connectDatabase();

// Middleware
app.use(express.json());
const cors = require('cors');
app.use(cors({ origin: "http://localhost:5173", credentials: true }));


// Restrict access to Thapar network
app.use(restrictToThaparNetwork);

// Import routes
const auth = require('./routes/auth');
const department = require('./routes/department');
const course = require('./routes/course');
const experiment = require('./routes/experiment');
const coordinator = require('./routes/coordinator');
const lab = require('./routes/lab');

// Mount routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/departments', department);
app.use('/api/v1/courses', course);
app.use('/api/v1/experiments', experiment);
app.use('/api/v1/coordinator', coordinator);
app.use('/api/v1/lab', lab);

// Error handling middleware
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
}); 