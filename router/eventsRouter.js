const express = require('express');
const router = express.Router();
const {
    addEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    addParticipant,
    removeParticipant,
    exportEventToPDF
} = require('../controller/eventsController');

// Event CRUD operations
router.post('/', addEvent);                    // Create new event
router.get('/', getEvents);                    // Get all events
router.get('/:eventId', getEventById);         // Get event by ID
router.put('/:eventId', updateEvent);          // Update event
router.delete('/:eventId', deleteEvent);       // Delete event

// Participant management
router.post('/:eventId/participants', addParticipant);           // Add participant
router.delete('/:eventId/participants', removeParticipant);      // Remove participant

// Export functionality
router.get('/:eventId/export', exportEventToPDF);                // Export event to PDF

module.exports = router; 