const express = require('express');
const router = express.Router();
const { 
  getQuestions, 
  submitTest, 
  getResults, 
  getTestResult 
} = require('../controllers/testController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/questions', getQuestions);

// Protected routes
router.use(protect);
router.post('/submit', submitTest);
router.get('/results', getResults);
router.get('/results/:id', getTestResult);

module.exports = router; 