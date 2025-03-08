const express = require('express');
const router = express.Router();
const { 
  getCareerRecommendations,
  getCareerBookRecommendations,
  getCareerCourseRecommendations,
  getCareerCollegeRecommendations,
  getCareerArticleRecommendations
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

// Apply protection middleware to all routes
router.use(protect);

// Recommendation routes
router.get('/career/:id', getCareerRecommendations);
router.get('/career/:id/books', getCareerBookRecommendations);
router.get('/career/:id/courses', getCareerCourseRecommendations);
router.get('/career/:id/colleges', getCareerCollegeRecommendations);
router.get('/career/:id/articles', getCareerArticleRecommendations);

module.exports = router; 