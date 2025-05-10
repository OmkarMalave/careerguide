const Question = require('../models/Question');
const TestResult = require('../models/TestResult');
const Career = require('../models/Career');
const User = require('../models/User');
const Test = require('../models/Test');

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
    const { answers, educationLevel } = req.body;
    
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide test answers'
      });
    }
    
    // Calculate scores based on answers
    const scores = await calculateScores(answers);
    
    // Get recommended careers based on scores and education level
    const recommendedCareers = await getRecommendedCareers(scores, educationLevel);
    
    // Create new test result
    const testResult = new Test({
      user: req.user._id,
      answers,
      scores,
      educationLevel,
      recommendedCareers: recommendedCareers.map(career => career._id),
      completedAt: new Date()
    });
    
    await testResult.save();
    
    res.status(201).json({
      success: true,
      data: {
        ...testResult.toObject(),
        recommendedCareers
      }
    });
  } catch (error) {
    console.error('Error submitting test:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit test results'
    });
  }
};

// @desc    Get user's test results
// @route   GET /api/test/results
// @access  Private
exports.getResults = async (req, res) => {
  try {
    const results = await Test.find({ user: req.user._id })
      .sort({ completedAt: -1 })
      .populate('recommendedCareers');
    
    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error fetching test results:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch test results'
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

// Helper function to calculate scores
const calculateScores = async (answers) => {
  const scores = {
    interests: {
      analytical: 0,
      creative: 0,
      social: 0
    },
    personality: {
      structured: 0,
      independent: 0,
      teamwork: 0
    },
    skills: {
      technical: 0,
      communication: 0,
      creative: 0
    },
    values: {
      security: 0,
      growth: 0,
      balance: 0
    }
  };
  
  // Get all questions
  const questions = await Question.find({ active: true });
  
  // Calculate scores based on answer patterns
  answers.forEach(answer => {
    const { category, selectedOption } = answer;
    const question = questions.find(q => q._id.toString() === answer.question.toString());
    
    if (question && question.options[selectedOption]) {
      const optionScores = question.options[selectedOption].score;
      // Convert Map to object if it's a Map
      const scoresObj = optionScores instanceof Map ? Object.fromEntries(optionScores) : optionScores;
      
      Object.entries(scoresObj).forEach(([key, value]) => {
        if (scores[category] && scores[category][key] !== undefined) {
          scores[category][key] += value;
        }
      });
    }
  });
  
  // Normalize scores to 0-10 range
  Object.keys(scores).forEach(category => {
    Object.keys(scores[category]).forEach(trait => {
      scores[category][trait] = Math.round((scores[category][trait] / 10) * 10);
    });
  });
  
  return scores;
};

// Helper function to get recommended careers
const getRecommendedCareers = async (scores, educationLevel) => {
  try {
    // Get all careers
    const careers = await Career.find();
    
    // Calculate match score for each career
    const careerScores = careers.map(career => {
      const matchScore = calculateCareerMatch(career, scores);
      return { career, score: matchScore };
    });
    
    // Sort by match score and get top 5
    return careerScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.career);
  } catch (error) {
    console.error('Error getting recommended careers:', error);
    return [];
  }
};

// Helper function to calculate career match score
const calculateCareerMatch = (career, scores) => {
  let matchScore = 0;
  
  // Match interests
  if (career.careerTraits) {
    if (career.careerTraits.analytical) {
      matchScore += scores.interests.analytical * career.careerTraits.analytical / 10;
    }
    if (career.careerTraits.creative) {
      matchScore += scores.interests.creative * career.careerTraits.creative / 10;
    }
    if (career.careerTraits.social) {
      matchScore += scores.interests.social * career.careerTraits.social / 10;
    }
  }
  
  // Match personality
  if (career.careerTraits) {
    if (career.careerTraits.structured) {
      matchScore += scores.personality.structured * career.careerTraits.structured / 10;
    }
    if (career.careerTraits.independent) {
      matchScore += scores.personality.independent * career.careerTraits.independent / 10;
    }
    if (career.careerTraits.teamwork) {
      matchScore += scores.personality.teamwork * career.careerTraits.teamwork / 10;
    }
  }
  
  // Match skills
  if (career.careerTraits) {
    if (career.careerTraits.technical) {
      matchScore += scores.skills.technical * career.careerTraits.technical / 10;
    }
    if (career.careerTraits.communication) {
      matchScore += scores.skills.communication * career.careerTraits.communication / 10;
    }
    if (career.careerTraits.creative) {
      matchScore += scores.skills.creative * career.careerTraits.creative / 10;
    }
  }
  
  // Match values
  if (career.careerTraits) {
    if (career.careerTraits.security) {
      matchScore += scores.values.security * career.careerTraits.security / 10;
    }
    if (career.careerTraits.growth) {
      matchScore += scores.values.growth * career.careerTraits.growth / 10;
    }
    if (career.careerTraits.balance) {
      matchScore += scores.values.balance * career.careerTraits.balance / 10;
    }
  }
  
  return matchScore;
}; 