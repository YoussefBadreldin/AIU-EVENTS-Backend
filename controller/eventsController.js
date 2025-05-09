const EventsModel = require('../models/eventsModel');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Add a new event
const addEvent = async (req, res) => {
    try {
        const { eventName, eventDescription, eventDate, participants } = req.body;

        // Validate required fields
        if (!eventName || !eventDescription || !eventDate) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create a new event
        const newEvent = new EventsModel({
            eventName,
            eventDescription,
            eventDate,
            participants: participants || []
        });

        await newEvent.save();
        return res.status(201).json({ message: 'Event added successfully', event: newEvent });
    } catch (error) {
        console.error('Error adding event:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get all events
const getEvents = async (req, res) => {
    try {
        const events = await EventsModel.find().sort({ eventDate: 1 });
        return res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get event by ID
const getEventById = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await EventsModel.findById(eventId);
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        return res.status(200).json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update event
const updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { eventName, eventDescription, eventDate } = req.body;

        const event = await EventsModel.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Update fields
        event.eventName = eventName || event.eventName;
        event.eventDescription = eventDescription || event.eventDescription;
        event.eventDate = eventDate || event.eventDate;

        await event.save();
        return res.status(200).json({ message: 'Event updated successfully', event });
    } catch (error) {
        console.error('Error updating event:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete event
const deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await EventsModel.findByIdAndDelete(eventId);
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        return res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Add participant to event
const addParticipant = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { studentId, name, major } = req.body;

        if (!studentId || !name || !major) {
            return res.status(400).json({ message: 'Missing required participant information' });
        }

        const event = await EventsModel.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if participant already exists
        const participantExists = event.participants.some(p => p.studentId === studentId);
        if (participantExists) {
            return res.status(400).json({ message: 'Participant already registered' });
        }

        event.participants.push({ studentId, name, major });
        await event.save();

        return res.status(200).json({ message: 'Participant added successfully', event });
    } catch (error) {
        console.error('Error adding participant:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Remove participant from event
const removeParticipant = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { studentId } = req.body;

        const event = await EventsModel.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.participants = event.participants.filter(p => p.studentId !== studentId);
        await event.save();

        return res.status(200).json({ message: 'Participant removed successfully', event });
    } catch (error) {
        console.error('Error removing participant:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Export event details to PDF
const exportEventToPDF = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await EventsModel.findById(eventId);
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const doc = new PDFDocument();
        const filename = `Event_${event.eventName.replace(/\s+/g, '_')}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

        // Add university logo and header
        doc.fontSize(24).text('Alamein International University', { align: 'center' });
        doc.moveDown();

        // Event details
        doc.fontSize(20).text(event.eventName, { align: 'center' });
        doc.moveDown();
        
        doc.fontSize(12)
           .text('Description:', { underline: true })
           .text(event.eventDescription)
           .moveDown()
           .text('Date:', { underline: true })
           .text(new Date(event.eventDate).toLocaleString())
           .moveDown()
           .text('Participants:', { underline: true });

        // Participants table
        let y = doc.y;
        event.participants.forEach((participant, index) => {
            doc.text(`${index + 1}. ${participant.name}`, 50, y)
               .text(participant.studentId, 200, y)
               .text(participant.major, 350, y);
            y += 20;
        });

        doc.pipe(res);
        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    addEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    addParticipant,
    removeParticipant,
    exportEventToPDF
}; 