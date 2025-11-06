// ============================================================================
// API Routes
// ============================================================================

const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// ============================================================================
// CRUD ROUTES
// ============================================================================

// GET all entries
router.get('/data', dataController.getAllData);

// GET entry by ID
router.get('/data/:id', dataController.getDataById);

// POST - Create new entry
router.post('/data', dataController.createData);

// PUT - Update entry by ID
router.put('/data/:id', dataController.updateData);

// DELETE - Delete entry by ID
router.delete('/data/:id', dataController.deleteData);

// ============================================================================
// QUESTION ROUTES (8 Questions from HW1)
// ============================================================================

// Question 1: What is the fastest growing city?
router.get('/questions/1', dataController.question1);

// Question 2: What is the most populous city?
router.get('/questions/2', dataController.question2);

// Question 3: What is the average population across all cities?
router.get('/questions/3', dataController.question3);

// Question 4: Which city has the highest population density?
router.get('/questions/4', dataController.question4);

// Question 5: What is the total population of all cities combined?
router.get('/questions/5', dataController.question5);

// Question 6: Which cities have a growth rate above 3%?
router.get('/questions/6', dataController.question6);

// Question 7: What is the youngest city (lowest average age)?
router.get('/questions/7', dataController.question7);

// Question 8: How many cities have a population greater than 200,000?
router.get('/questions/8', dataController.question8);

module.exports = router;
