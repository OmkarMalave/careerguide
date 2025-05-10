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

// Career routes
router.route('/').get(getCareers);
router.route('/web-search').get(searchWebCareers);
router.route('/selected').get(getSelectedCareers);
router.route('/:id').get(getCareer);
router.route('/:id/select').post(selectCareer).delete(unselectCareer);

// @route   GET /api/v1/careers
// @desc    Get all careers
router.get('/', (req, res) => {
  res.status(200).json({ success: true, msg: 'Get all careers' });
});

// @route   GET /api/v1/careers/:id
// @desc    Get single career
router.get('/:id', (req, res) => {
  res.status(200).json({ success: true, msg: `Get career ${req.params.id}` });
});

module.exports = router; 