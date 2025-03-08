const Career = require('../models/Career');
const User = require('../models/User');

// @desc    Get all careers
// @route   GET /api/careers
// @access  Private
exports.getCareers = async (req, res) => {
  try {
    const careers = await Career.find();
    
    res.status(200).json({
      success: true,
      count: careers.length,
      data: careers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get a single career
// @route   GET /api/careers/:id
// @access  Private
exports.getCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    
    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: career
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Select a career
// @route   POST /api/careers/:id/select
// @access  Private
exports.selectCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    
    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career not found'
      });
    }
    
    // Check if career is already selected
    const user = await User.findById(req.user.id);
    
    if (user.selectedCareers.includes(career._id)) {
      return res.status(400).json({
        success: false,
        message: 'Career already selected'
      });
    }
    
    // Add career to user's selected careers
    await User.findByIdAndUpdate(req.user.id, {
      $push: { selectedCareers: career._id }
    });
    
    res.status(200).json({
      success: true,
      message: 'Career selected successfully',
      data: career
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Unselect a career
// @route   DELETE /api/careers/:id/select
// @access  Private
exports.unselectCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    
    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career not found'
      });
    }
    
    // Remove career from user's selected careers
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { selectedCareers: career._id }
    });
    
    res.status(200).json({
      success: true,
      message: 'Career unselected successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get user's selected careers
// @route   GET /api/careers/selected
// @access  Private
exports.getSelectedCareers = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('selectedCareers');
    
    res.status(200).json({
      success: true,
      count: user.selectedCareers.length,
      data: user.selectedCareers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
}; 