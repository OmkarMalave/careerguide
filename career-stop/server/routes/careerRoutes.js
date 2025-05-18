const express = require('express');
const router = express.Router();
const { 
  getCareers, 
  getCareer, 
  selectCareer, 
  unselectCareer, 
  getSelectedCareers,
  searchWebCareers
} = require('../controllers/careerController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getCareers);
router.get('/:id', getCareer);
router.get('/web-search', searchWebCareers);

// Protected routes
router.post('/:id/select', protect, selectCareer);
router.delete('/:id/select', protect, unselectCareer);
router.get('/selected', protect, getSelectedCareers);

module.exports = router; 