const mongoose = require('mongoose');

const StudentsSchema = new mongoose.Schema({
    student_id: { 
        type: String, 
        required: [true, 'Student ID is required'],
        unique: true,
        trim: true
    },
    student_name: { 
        type: String, 
        required: [true, 'Student name is required'],
        trim: true
    },
    student_faculty: { 
        type: String, 
        required: [true, 'Faculty is required'],
        trim: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Index for faster queries
StudentsSchema.index({ student_id: 1 });

const StudentsModel = mongoose.model('Student', StudentsSchema);
module.exports = StudentsModel;