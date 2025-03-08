const express = require('express');
const router = express.Router();
const { 
  getCareers, 
  getCareer, 
  selectCareer, 
  unselectCareer, 
  getSelectedCareers 
} = require('../controllers/careerController');
const { protect } = require('../middleware/auth');

// Apply protection middleware to all routes
router.use(protect);

// Career routes
router.get('/', getCareers);
router.get('/selected', getSelectedCareers);
router.get('/:id', getCareer);
router.post('/:id/select', selectCareer);
router.delete('/:id/select', unselectCareer);

module.exports = router; 