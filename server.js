require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer'); // Import multer for file uploads

// Initialize express app
const app = express();

// Import routes
const StudentsRoutes = require('./router/StudentsRouter');
const EventsRouter = require('./router/eventsRouter'); // Import Events Router

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Connect to MongoDB using the environment variable
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/sdata', StudentsRoutes);
app.use('/events', EventsRouter); // Add Events Router

// Default route for health check
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Export the app for serverless deployment (if needed)
module.exports = app;