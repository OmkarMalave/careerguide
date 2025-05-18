const express = require('express');
const router = express.Router();
const { 
  getCareerRecommendations,
  getCareerBookRecommendations,
  getCareerCourseRecommendations,
  getCareerCollegeRecommendations,
  getCareerArticleRecommendations,
  getPersonalizedRecommendations
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

// Apply protection middleware to all routes
router.use(protect);

// Personalized recommendations
router.get('/personalized', getPersonalizedRecommendations);

// Career-specific recommendations
router.get('/career/:id', getCareerRecommendations);
router.get('/career/:id/books', getCareerBookRecommendations);
router.get('/career/:id/courses', getCareerCourseRecommendations);
router.get('/career/:id/colleges', getCareerCollegeRecommendations);
router.get('/career/:id/articles', getCareerArticleRecommendations);

module.exports = router; 