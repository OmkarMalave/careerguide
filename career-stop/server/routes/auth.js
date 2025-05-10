const express = require('express');
const router = express.Router();

// @route   POST /api/v1/auth/register
// @desc    Register user
router.post('/register', (req, res) => {
  res.status(200).json({ success: true, msg: 'Register route' });
});

// @route   POST /api/v1/auth/login
// @desc    Login user
router.post('/login', (req, res) => {
  res.status(200).json({ success: true, msg: 'Login route' });
});

module.exports = router; 