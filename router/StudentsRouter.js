const express = require('express');
const router = express.Router();
const StudentsController = require('../controller/StudentsController');

// POST /students - Create a new student
router.post('/', StudentsController.addStudent);

// GET /students - Get all students
router.get('/', StudentsController.getStudents);

module.exports = router;