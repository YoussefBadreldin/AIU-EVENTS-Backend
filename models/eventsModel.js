const mongoose = require('mongoose');

const EventsSchema = new mongoose.Schema({
    eventName: { 
        type: String, 
        required: true,
        trim: true
    },
    eventDescription: { 
        type: String, 
        required: true,
        trim: true
    },
    eventDate: { 
        type: Date, 
        required: true
    },
    participants: [{
        studentId: { type: String, required: true },
        name: { type: String, required: true },
        major: { type: String, required: true }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
EventsSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const EventsModel = mongoose.model('Event', EventsSchema);
module.exports = EventsModel; 