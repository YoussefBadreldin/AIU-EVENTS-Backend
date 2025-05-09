// api/index.js
require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer'); // Import multer for file uploads

// Initialize express app
const app = express();

// Import routes
const StudentsRoutes = require('../router/StudentsRouter');
const MembersRouter = require('../router/MembersRouter');
const ClubsRouter = require('../router/ClubsRouter');
const SportsRouter = require('../router/SportsRouter');
const CulturalRouter = require('../router/CulturalRouter');
const SocialRouter = require('../router/SocialRouter');
const ScoutRouter = require('../router/ScoutRouter');
const ScientificRouter = require('../router/ScientificRouter');
const ArtsRouter = require('../router/ArtsRouter');
const ActivitiesRouter = require('../router/ActivitiesRouter');
const PlaceRouter = require('../router/PlaceRouter');
const ComplaintsSuggestionsRouter = require('../router/ComplaintsSuggestionsRouter');
const EventsRouter = require('../router/eventsRouter'); // Import Events Router

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
app.use('/members', MembersRouter);
app.use('/clubs', ClubsRouter);
app.use('/sports', SportsRouter);
app.use('/cultural', CulturalRouter);
app.use('/social', SocialRouter);
app.use('/scout', ScoutRouter);
app.use('/scientific', ScientificRouter);
app.use('/arts', ArtsRouter);
app.use('/activities', ActivitiesRouter);
app.use('/places', PlaceRouter);
app.use('/complaints-suggestions', ComplaintsSuggestionsRouter);
app.use('/events', EventsRouter); // Add Events Router

// Default route for health check
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Export the app for Vercel serverless deployment
module.exports = app;