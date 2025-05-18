// This file is being renamed to careers.old.js
// Original content is preserved below for reference if needed.

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

/*
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

// @route   POST /api/v1/careers/:id/select
// @desc    Select a career for logged in user
router.post('/:id/select', (req, res) => {
  res.status(200).json({ success: true, msg: `Select career ${req.params.id}` });
});

// @route   DELETE /api/v1/careers/:id/select
// @desc    Unselect a career for logged in user
router.delete('/:id/select', (req, res) => {
  res.status(200).json({ success: true, msg: `Unselect career ${req.params.id}` });
});

// @route   GET /api/v1/careers/selected
// @desc    Get selected careers for logged in user
router.get('/selected', (req, res) => {
  res.status(200).json({ success: true, msg: 'Get selected careers' });
});

module.exports = router;
*/ 