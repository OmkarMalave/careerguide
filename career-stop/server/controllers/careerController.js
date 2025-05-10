const Career = require('../models/Career');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

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

// @desc    Search for careers on the web
// @route   GET /api/v1/careers/web-search
// @access  Public
exports.searchWebCareers = asyncHandler(async (req, res, next) => {
  const query = req.query.q;
  
  if (!query) {
    return next(new ErrorResponse('Please provide a search query', 400));
  }

  try {
    // Use web search API to find career information
    const searchResults = await fetch(`https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}+career+information`, {
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.BING_API_KEY
      }
    });

    const data = await searchResults.json();

    // Format the results
    const formattedResults = data.webPages.value.map(result => ({
      title: result.name,
      description: result.snippet,
      link: result.url
    }));

    res.status(200).json({
      success: true,
      results: formattedResults.slice(0, 6) // Return top 6 results
    });
  } catch (error) {
    // If web search fails, return empty results
    console.error('Web search error:', error);
    res.status(200).json({
      success: true,
      results: []
    });
  }
}); 