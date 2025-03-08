const Question = require('../models/Question');
const TestResult = require('../models/TestResult');
const Career = require('../models/Career');
const User = require('../models/User');

// @desc    Get all test questions
// @route   GET /api/test/questions
// @access  Private
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ active: true });
    
    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Submit test answers and get results
// @route   POST /api/test/submit
// @access  Private
exports.submitTest = async (req, res) => {
  try {
    const { answers } = req.body;
    
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide test answers'
      });
    }
    
    // Calculate scores based on answers
    const scores = await calculateScores(answers);
    
    // Find recommended careers based on scores
    const recommendedCareers = await findRecommendedCareers(scores);
    
    // Create test result
    const testResult = await TestResult.create({
      user: req.user.id,
      answers,
      scores,
      recommendedCareers: recommendedCareers.map(career => career._id)
    });
    
    // Update user's test results
    await User.findByIdAndUpdate(req.user.id, {
      $push: { testResults: testResult._id }
    });
    
    res.status(201).json({
      success: true,
      data: {
        testResult,
        recommendedCareers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get user's test results
// @route   GET /api/test/results
// @access  Private
exports.getTestResults = async (req, res) => {
  try {
    const testResults = await TestResult.find({ user: req.user.id })
      .populate('recommendedCareers')
      .sort('-completedAt');
    
    res.status(200).json({
      success: true,
      count: testResults.length,
      data: testResults
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get a specific test result
// @route   GET /api/test/results/:id
// @access  Private
exports.getTestResult = async (req, res) => {
  try {
    const testResult = await TestResult.findById(req.params.id)
      .populate('recommendedCareers');
    
    if (!testResult) {
      return res.status(404).json({
        success: false,
        message: 'Test result not found'
      });
    }
    
    // Check if the test result belongs to the user
    if (testResult.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this test result'
      });
    }
    
    res.status(200).json({
      success: true,
      data: testResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Helper function to calculate scores based on answers
const calculateScores = async (answers) => {
  const scores = {};
  
  // Get all questions to access their scoring information
  const questionIds = answers.map(answer => answer.question);
  const questions = await Question.find({ _id: { $in: questionIds } });
  
  // Calculate scores for each answer
  for (const answer of answers) {
    const question = questions.find(q => q._id.toString() === answer.question.toString());
    
    if (question && question.options[answer.selectedOption]) {
      const optionScores = question.options[answer.selectedOption].score;
      
      // Add scores to the total
      for (const [trait, score] of optionScores.entries()) {
        if (!scores[trait]) {
          scores[trait] = 0;
        }
        scores[trait] += score;
      }
    }
  }
  
  return scores;
};

// Helper function to find recommended careers based on scores
const findRecommendedCareers = async (scores) => {
  // Get all careers
  const careers = await Career.find();
  
  // Calculate match score for each career
  const careerMatches = careers.map(career => {
    let matchScore = 0;
    let totalTraits = 0;
    
    // Compare user's scores with career traits
    for (const [trait, score] of Object.entries(scores)) {
      if (career.careerTraits.has(trait)) {
        const careerTraitScore = career.careerTraits.get(trait);
        // Calculate similarity (higher is better)
        const similarity = 1 - Math.abs(score - careerTraitScore) / 10; // Assuming scores range from 0-10
        matchScore += similarity;
        totalTraits++;
      }
    }
    
    // Calculate average match score
    const averageMatchScore = totalTraits > 0 ? matchScore / totalTraits : 0;
    
    return {
      career,
      matchScore: averageMatchScore
    };
  });
  
  // Sort careers by match score (descending)
  careerMatches.sort((a, b) => b.matchScore - a.matchScore);
  
  // Return top 5 matching careers
  return careerMatches.slice(0, 5).map(match => match.career);
}; 