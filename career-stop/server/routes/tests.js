const express = require('express');
const router = express.Router();
const { 
  getQuestions, 
  submitTest, 
  getResults, 
  getTestResult 
} = require('../controllers/testController');
const { protect } = require('../middleware/auth');

// Apply protection middleware to all routes
router.use(protect);

// Test routes
router.get('/questions', getQuestions);
router.post('/submit', submitTest);
router.get('/results', getResults);
router.get('/results/:id', getTestResult);

module.exports = router; 