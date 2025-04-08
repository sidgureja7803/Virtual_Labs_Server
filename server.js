const express = require("express");
const connectDatabase = require("./config/db");
const cors = require("cors");
require("dotenv").config();

// Create Express app
const app = express();

// Connect to database
connectDatabase();

// Middleware
app.use(express.json());
app.use(cors());

// Import routes
const instructor = require("./routes/instructor.routes");
const student = require("./routes/student.routes");
const courseCoordinator = require("./routes/courseCoordinator.routes");

// Mount routes
app.use("/", (req, res) => {
  res.send("Welcome to the virtual lab");
});
app.use("/instructor", instructor);
app.use("/student", student);
app.use("/courseCoordinator", courseCoordinator);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
