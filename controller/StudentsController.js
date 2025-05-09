const StudentsModel = require('../models/StudentsModel');

const addStudent = async (req, res) => {
    try {
        const { student_id, student_name, student_faculty } = req.body;
        
        const newStudent = new StudentsModel({
            student_id,
            student_name,
            student_faculty
        });

        await newStudent.save();
        return res.status(201).json({ 
            message: 'Student added successfully',
            student: newStudent 
        });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: 'Student ID already exists' });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getStudents = async (req, res) => {
    try {
        const students = await StudentsModel.find().select('student_id student_name student_faculty');
        return res.status(200).json(students);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { 
    addStudent, 
    getStudents 
};