const Career = require('../models/Career');

// @desc    Get recommendations for a career
// @route   GET /api/recommendations/career/:id
// @access  Private
exports.getCareerRecommendations = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    
    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career not found'
      });
    }
    
    // Extract recommendations from career
    const recommendations = {
      books: career.books || [],
      courses: career.courses || [],
      colleges: career.colleges || [],
      articles: career.articles || []
    };
    
    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get book recommendations for a career
// @route   GET /api/recommendations/career/:id/books
// @access  Private
exports.getCareerBookRecommendations = async (req, res) => {
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
      count: career.books.length,
      data: career.books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get course recommendations for a career
// @route   GET /api/recommendations/career/:id/courses
// @access  Private
exports.getCareerCourseRecommendations = async (req, res) => {
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
      count: career.courses.length,
      data: career.courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get college recommendations for a career
// @route   GET /api/recommendations/career/:id/colleges
// @access  Private
exports.getCareerCollegeRecommendations = async (req, res) => {
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
      count: career.colleges.length,
      data: career.colleges
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get article recommendations for a career
// @route   GET /api/recommendations/career/:id/articles
// @access  Private
exports.getCareerArticleRecommendations = async (req, res) => {
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
      count: career.articles.length,
      data: career.articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
}; 