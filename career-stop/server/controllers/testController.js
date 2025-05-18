const Question = require('../models/Question');
const Career = require('../models/Career');
const User = require('../models/User');
const Test = require('../models/Test');

// @desc    Get all test questions
// @route   GET /api/test/questions
// @access  Private
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.aggregate([
      { $match: { active: true } },
      { $sample: { size: 20 } }
    ]);
    
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
    
    // Validate request body
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide test answers'
      });
    }

    if (!educationLevel || !['10th', '12th', 'Graduate'].includes(educationLevel)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid education level'
      });
    }

    // Log the incoming request data
    console.log('Test submission request:', {
      userId: req.user._id,
      answerCount: answers.length,
      educationLevel
    });
    
    // Calculate total user score
    const scoreData = await calculateScores(answers);
    console.log('Score calculation result:', scoreData);
    
    // Get recommended careers based on total score and education level
    const recommendedCareers = await getRecommendedCareers(scoreData, educationLevel);
    console.log('Recommended careers count:', recommendedCareers.length);
    
    // Create new test result
    const testResult = new Test({
      user: req.user._id,
      answers,
      scores: {
        totalUserScore: scoreData.totalUserScore,
        numberOfQuestionsAnswered: scoreData.numberOfQuestionsAnswered,
        userPercentageScore: scoreData.userPercentageScore
      },
      educationLevel,
      recommendedCareers: recommendedCareers.map(career => career._id),
      completedAt: new Date()
    });
    
    await testResult.save();
    console.log('Test result saved:', testResult._id);
    
    // Populate recommended careers for the response
    const populatedTestResult = await Test.findById(testResult._id)
      .populate('recommendedCareers')
      .lean();
    
    // Add match scores and reasons to the response
    const enhancedResult = {
      ...populatedTestResult,
      recommendedCareers: populatedTestResult.recommendedCareers.map((career, index) => ({
        ...career,
        matchScore: recommendedCareers[index]?.matchScore || 0,
        matchReasons: recommendedCareers[index]?.matchReasons || []
      }))
    };
    
    res.status(201).json({
      success: true,
      data: enhancedResult
    });
  } catch (error) {
    console.error('Error submitting test:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit test results',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
    const testResult = await Test.findById(req.params.id)
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
  try {
    let totalUserScore = 0;
    const questionIds = answers.map(a => a.question);
    const questions = await Question.find({ '_id': { $in: questionIds } });

    // Calculate scores for each answer
    const scores = answers.map(answer => {
      const question = questions.find(q => q._id.toString() === answer.question.toString());
      let score = 0;
      
      if (question && question.options && answer.selectedOption !== undefined) {
        const selectedOption = question.options[answer.selectedOption];
        if (selectedOption && typeof selectedOption.score === 'number') {
          score = selectedOption.score;
          totalUserScore += score;
        }
      }
      
      return {
        category: question?.category || 'unknown',
        value: score
      };
    });

    const numberOfQuestionsAnswered = answers.length;
    const maxScorePerQuestion = 5; // Assuming max score per question is 5
    const maximumPossibleScore = numberOfQuestionsAnswered * maxScorePerQuestion;
    
    // Calculate percentage score, ensuring it's a valid number
    const userPercentageScore = maximumPossibleScore > 0 
      ? Math.round((totalUserScore / maximumPossibleScore) * 100)
      : 0;

    // Validate scores before returning
    if (isNaN(totalUserScore) || isNaN(userPercentageScore)) {
      throw new Error('Invalid score calculation');
    }

    return { 
      totalUserScore: Number(totalUserScore), 
      numberOfQuestionsAnswered: Number(numberOfQuestionsAnswered), 
      userPercentageScore: Number(userPercentageScore),
      scores 
    };
  } catch (error) {
    console.error('Error calculating scores:', error);
    throw new Error('Failed to calculate test scores');
  }
};

// Helper function to get recommended careers
const getRecommendedCareers = async (scoreData, educationLevel) => {
  try {
    const { userPercentageScore, scores } = scoreData;
    const allCareersDb = await Career.find();
    
    // Analyze user's score patterns
    const scorePatterns = analyzeScorePatterns(scores);
    console.log('Score patterns:', scorePatterns);
    
    // Score each career based on multiple factors
    const scoredCareers = allCareersDb.map(career => {
      let score = 0;
      let matchReasons = [];
      
      // 1. Personality Match (35% weight)
      if (career.careerTraits) {
        const traitScore = Object.entries(career.careerTraits)
          .reduce((sum, [trait, value]) => {
            const patternScore = scorePatterns[trait] || 0;
            const matchScore = (patternScore * value) / 10;
            return sum + matchScore;
          }, 0);
        
        const traitMatchScore = Math.min(35, traitScore);
        score += traitMatchScore;
        
        if (traitMatchScore > 25) {
          matchReasons.push('Strong personality match');
        } else if (traitMatchScore > 15) {
          matchReasons.push('Good personality match');
        }
      }

      // 2. Education Level Match (25% weight)
      const educationLevels = {
        '10th': 1,
        '12th': 2,
        'Graduate': 3
      };
      
      const userEducationLevel = educationLevels[educationLevel] || 0;
      const careerEducationLevel = educationLevels[career.educationRequirements?.split(' ')[0]] || 0;
      
      const educationDiff = Math.abs(userEducationLevel - careerEducationLevel);
      if (educationDiff === 0) {
        score += 25;
        matchReasons.push('Perfect education level match');
      } else if (educationDiff === 1) {
        score += 20;
        matchReasons.push('Good education level match');
      } else if (educationDiff === 2) {
        score += 15;
        matchReasons.push('Acceptable education level match');
      }

      // 3. Skills Match (25% weight)
      if (career.skills && Array.isArray(career.skills)) {
        const skillsMatchScore = Math.min(25, career.skills.length * 2.5);
        score += skillsMatchScore;
        if (skillsMatchScore > 15) {
          matchReasons.push('Strong skills match');
        } else if (skillsMatchScore > 10) {
          matchReasons.push('Good skills match');
        }
      }

      // 4. Score Range Match (15% weight)
      if (career.targetPercentageRange) {
        const { min, max } = career.targetPercentageRange;
        if (userPercentageScore >= min && userPercentageScore <= max) {
          score += 15;
          matchReasons.push('Matches your test score range');
        } else {
          const distance = Math.min(
            Math.abs(userPercentageScore - min),
            Math.abs(userPercentageScore - max)
          );
          const partialScore = Math.max(0, 15 - (distance * 0.5));
          score += partialScore;
          if (partialScore > 7) {
            matchReasons.push('Close match to your test score');
          }
        }
      }

      return {
        career,
        score,
        matchReasons
      };
    });

    // Sort careers by score and get top recommendations
    const recommendedCareers = scoredCareers
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(item => ({
        ...item.career.toObject(),
        matchScore: Math.round(item.score),
        matchReasons: item.matchReasons
      }));

    // If no careers meet the criteria, provide default recommendations
    if (recommendedCareers.length === 0) {
      const defaultCareers = getDefaultCareers(educationLevel, scorePatterns);
      return defaultCareers;
    }
    
    return recommendedCareers;
  } catch (error) {
    console.error('Error getting recommended careers:', error);
    // Return default careers in case of error
    return getDefaultCareers(educationLevel, {});
  }
};

// Helper function to analyze score patterns
const analyzeScorePatterns = (scores) => {
  const patterns = {
    technical: 0,
    analytical: 0,
    creative: 0,
    social: 0,
    practical: 0,
    leadership: 0,
    communication: 0,
    problemSolving: 0
  };

  // Group scores by category
  const categoryScores = scores.reduce((acc, score) => {
    if (!acc[score.category]) {
      acc[score.category] = [];
    }
    acc[score.category].push(score.value);
    return acc;
  }, {});

  // Calculate average scores for each category
  Object.entries(categoryScores).forEach(([category, values]) => {
    const avgScore = values.reduce((sum, val) => sum + val, 0) / values.length;
    patterns[category] = Math.min(10, avgScore);
  });

  // Map categories to personality traits
  const traitMapping = {
    technical: ['technical', 'analytical', 'problemSolving'],
    analytical: ['analytical', 'problemSolving', 'technical'],
    creative: ['creative', 'communication', 'social'],
    social: ['social', 'communication', 'leadership'],
    practical: ['practical', 'problemSolving', 'technical'],
    leadership: ['leadership', 'communication', 'social'],
    communication: ['communication', 'social', 'leadership'],
    problemSolving: ['problemSolving', 'analytical', 'technical']
  };

  // Calculate trait scores based on category scores
  Object.entries(traitMapping).forEach(([category, traits]) => {
    const categoryScore = patterns[category] || 0;
    traits.forEach(trait => {
      patterns[trait] = Math.max(patterns[trait] || 0, categoryScore * 0.8);
    });
  });

  return patterns;
};

// Helper function to get default careers based on score patterns
const getDefaultCareers = (educationLevel, scorePatterns) => {
  const defaultCareers = {
    '10th': [
      // Technical careers
      {
        title: 'Automotive Technology',
        description: 'Learn automotive repair, maintenance, and diagnostics. Gain hands-on experience with modern vehicles and their systems.',
        skills: ['Vehicle Diagnostics', 'Engine Repair', 'Electrical Systems', 'Auto Maintenance'],
        educationRequirements: '10th Standard',
        averageSalary: '₹18,000 - ₹35,000 per month',
        jobOutlook: 'High demand in automotive industry',
        careerTraits: {
          technical: 9,
          practical: 9,
          problemSolving: 8,
          detailOriented: 8
        },
        books: [
          {
            title: 'Automotive Technology: Principles, Diagnosis, and Service',
            author: 'James D. Halderman',
            description: 'Comprehensive guide covering all aspects of automotive technology',
            link: 'https://www.amazon.com/Automotive-Technology-Principles-Diagnosis-Service/dp/0135257271'
          }
        ],
        courses: [
          {
            title: 'Automotive Service Technician',
            provider: 'ITI (Industrial Training Institute)',
            description: '2-year comprehensive course in automotive technology',
            duration: '2 years',
            isOnline: false,
            link: 'https://iti.gov.in/'
          }
        ],
        colleges: [
          {
            name: 'Government Industrial Training Institute',
            location: 'Multiple locations across India',
            programs: ['Automotive Technology', 'Auto Mechanics'],
            description: 'Government-run ITI offering comprehensive automotive training',
            link: 'https://iti.gov.in/'
          }
        ]
      },
      {
        title: 'CNC Machine Operation',
        description: 'Learn to operate and program Computer Numerical Control machines. Master precision manufacturing and industrial automation.',
        skills: ['CNC Programming', 'Machine Operation', 'Quality Control', 'Technical Drawing'],
        educationRequirements: '10th Standard',
        averageSalary: '₹22,000 - ₹45,000 per month',
        jobOutlook: 'High demand in manufacturing sector',
        careerTraits: {
          technical: 9,
          precision: 9,
          analytical: 8,
          practical: 9
        },
        books: [
          {
            title: 'CNC Programming Handbook',
            author: 'Peter Smid',
            description: 'Complete guide to CNC programming and operation',
            link: 'https://www.amazon.com/CNC-Programming-Handbook-Peter-Smid/dp/0831133478'
          }
        ],
        courses: [
          {
            title: 'CNC Machine Operation',
            provider: 'ITI (Industrial Training Institute)',
            description: 'Comprehensive training in CNC operations',
            duration: '2 years',
            isOnline: false,
            link: 'https://iti.gov.in/'
          }
        ],
        colleges: [
          {
            name: 'Government ITI Manufacturing',
            location: 'Multiple locations across India',
            programs: ['CNC Operation', 'Manufacturing Technology'],
            description: 'Government-certified CNC training program',
            link: 'https://iti.gov.in/'
          }
        ]
      },
      {
        title: 'Industrial Robotics',
        description: 'Learn to operate and maintain industrial robots. Master automation systems and robotic programming.',
        skills: ['Robotics Programming', 'Automation Systems', 'PLC Programming', 'System Maintenance'],
        educationRequirements: '10th Standard',
        averageSalary: '₹25,000 - ₹50,000 per month',
        jobOutlook: 'Growing demand in manufacturing automation',
        careerTraits: {
          technical: 9,
          analytical: 8,
          problemSolving: 9,
          precision: 9
        },
        books: [
          {
            title: 'Industrial Robotics: Theory, Modelling and Control',
            author: 'Sam Cubero',
            description: 'Comprehensive guide to industrial robotics',
            link: 'https://www.amazon.com/Industrial-Robotics-Theory-Modelling-Control/dp/3805581744'
          }
        ],
        courses: [
          {
            title: 'Industrial Robotics Certification',
            provider: 'FANUC India',
            description: 'Industry-recognized robotics training',
            duration: '1 year',
            isOnline: false,
            link: 'https://www.fanuc.co.in/'
          }
        ],
        colleges: [
          {
            name: 'FANUC Robotics Training Center',
            location: 'Multiple locations',
            programs: ['Industrial Robotics', 'Automation Technology'],
            description: 'Industry-leading robotics training facility',
            link: 'https://www.fanuc.co.in/'
          }
        ]
      },
      // Analytical careers
      {
        title: 'Digital Electronics',
        description: 'Study modern electronics, circuit design, and digital systems. Learn to repair and maintain electronic devices and equipment.',
        skills: ['Circuit Design', 'Digital Systems', 'Device Repair', 'Technical Troubleshooting'],
        educationRequirements: '10th Standard',
        averageSalary: '₹25,000 - ₹55,000 per month',
        jobOutlook: 'Growing demand in electronics and IT sectors',
        careerTraits: {
          technical: 9,
          analytical: 9,
          problemSolving: 9,
          detailOriented: 8
        },
        books: [
          {
            title: 'Digital Electronics: Principles and Applications',
            author: 'Roger L. Tokheim',
            description: 'Comprehensive guide to digital electronics',
            link: 'https://www.amazon.com/Digital-Electronics-Principles-Applications-Tokheim/dp/0073380573'
          }
        ],
        courses: [
          {
            title: 'Digital Electronics Certification',
            provider: 'ITI (Industrial Training Institute)',
            description: '2-year course in digital electronics and systems',
            duration: '2 years',
            isOnline: false,
            link: 'https://iti.gov.in/'
          }
        ],
        colleges: [
          {
            name: 'Government ITI Electronics',
            location: 'Multiple locations across India',
            programs: ['Digital Electronics', 'Electronics Technology'],
            description: 'Government-certified electronics program',
            link: 'https://iti.gov.in/'
          }
        ]
      },
      {
        title: 'Quality Control Technology',
        description: 'Learn quality assurance, testing procedures, and quality management systems. Master inspection and testing techniques.',
        skills: ['Quality Testing', 'Statistical Analysis', 'Process Control', 'Documentation'],
        educationRequirements: '10th Standard',
        averageSalary: '₹20,000 - ₹40,000 per month',
        jobOutlook: 'High demand across manufacturing sectors',
        careerTraits: {
          analytical: 9,
          detailOriented: 9,
          technical: 7,
          problemSolving: 8
        },
        books: [
          {
            title: 'Quality Control for Dummies',
            author: 'Larry Webber',
            description: 'Practical guide to quality control principles',
            link: 'https://www.amazon.com/Quality-Control-Dummies-Larry-Webber/dp/0470069093'
          }
        ],
        courses: [
          {
            title: 'Quality Control Certification',
            provider: 'Quality Council of India',
            description: 'Certified quality control training program',
            duration: '1 year',
            isOnline: false,
            link: 'https://www.qcin.org/'
          }
        ],
        colleges: [
          {
            name: 'Quality Council of India Training Center',
            location: 'Multiple locations',
            programs: ['Quality Control', 'Quality Management'],
            description: 'Government-recognized quality control training',
            link: 'https://www.qcin.org/'
          }
        ]
      },
      // Creative careers
      {
        title: 'Graphic Design Technology',
        description: 'Learn digital design, visual communication, and creative software. Master industry-standard design tools and techniques.',
        skills: ['Digital Design', 'Visual Communication', 'Software Tools', 'Creativity'],
        educationRequirements: '10th Standard',
        averageSalary: '₹20,000 - ₹45,000 per month',
        jobOutlook: 'High demand in digital media and advertising',
        careerTraits: {
          creative: 9,
          technical: 7,
          detailOriented: 8,
          communication: 8
        },
        books: [
          {
            title: 'Graphic Design School',
            author: 'David Dabner',
            description: 'Complete guide to graphic design principles and practice',
            link: 'https://www.amazon.com/Graphic-Design-School-Principles-Practice/dp/0500295354'
          }
        ],
        courses: [
          {
            title: 'Graphic Design Certification',
            provider: 'National Institute of Design',
            description: 'Comprehensive graphic design program',
            duration: '1 year',
            isOnline: false,
            link: 'https://www.nid.edu/'
          }
        ],
        colleges: [
          {
            name: 'National Institute of Design',
            location: 'Multiple locations',
            programs: ['Graphic Design', 'Visual Communication'],
            description: 'Premier design institute offering comprehensive training',
            link: 'https://www.nid.edu/'
          }
        ]
      },
      {
        title: 'Interior Design Technology',
        description: 'Learn space planning, interior decoration, and design software. Master both residential and commercial interior design.',
        skills: ['Space Planning', 'Design Software', 'Color Theory', 'Material Selection'],
        educationRequirements: '10th Standard',
        averageSalary: '₹25,000 - ₹60,000 per month',
        jobOutlook: 'Growing demand in real estate and construction',
        careerTraits: {
          creative: 9,
          technical: 7,
          communication: 8,
          detailOriented: 8
        },
        books: [
          {
            title: 'Interior Design Course',
            author: 'Tomris Tangaz',
            description: 'Complete guide to interior design principles',
            link: 'https://www.amazon.com/Interior-Design-Course-Principles-Practices/dp/0764121783'
          }
        ],
        courses: [
          {
            title: 'Interior Design Certification',
            provider: 'National Institute of Design',
            description: 'Comprehensive interior design program',
            duration: '1 year',
            isOnline: false,
            link: 'https://www.nid.edu/'
          }
        ],
        colleges: [
          {
            name: 'National Institute of Design',
            location: 'Multiple locations',
            programs: ['Interior Design', 'Space Design'],
            description: 'Premier design institute offering interior design training',
            link: 'https://www.nid.edu/'
          }
        ]
      },
      // Social/Service careers
      {
        title: 'Healthcare Assistant',
        description: 'Learn patient care, medical assistance, and healthcare procedures. Master basic medical support skills.',
        skills: ['Patient Care', 'Medical Assistance', 'Healthcare Procedures', 'Communication'],
        educationRequirements: '10th Standard',
        averageSalary: '₹18,000 - ₹35,000 per month',
        jobOutlook: 'High demand in healthcare sector',
        careerTraits: {
          social: 9,
          practical: 8,
          communication: 9,
          empathy: 9
        },
        books: [
          {
            title: 'Healthcare Assistant Handbook',
            author: 'Medical Training Institute',
            description: 'Complete guide to healthcare assistance',
            link: 'https://www.amazon.com/Healthcare-Assistant-Handbook-Training-Institute/dp/1234567890'
          }
        ],
        courses: [
          {
            title: 'Healthcare Assistant Certification',
            provider: 'Indian Red Cross Society',
            description: 'Certified healthcare assistant training',
            duration: '1 year',
            isOnline: false,
            link: 'https://indianredcross.org/'
          }
        ],
        colleges: [
          {
            name: 'Indian Red Cross Training Center',
            location: 'Multiple locations',
            programs: ['Healthcare Assistance', 'Medical Support'],
            description: 'Recognized healthcare training institute',
            link: 'https://indianredcross.org/'
          }
        ]
      },
      {
        title: 'Hospitality Management',
        description: 'Learn hotel operations, customer service, and hospitality management. Master food and beverage service.',
        skills: ['Customer Service', 'Hotel Operations', 'Food Service', 'Event Management'],
        educationRequirements: '10th Standard',
        averageSalary: '₹20,000 - ₹45,000 per month',
        jobOutlook: 'Growing demand in tourism and hospitality',
        careerTraits: {
          social: 9,
          communication: 9,
          practical: 8,
          service: 9
        },
        books: [
          {
            title: 'Introduction to Hospitality Management',
            author: 'John R. Walker',
            description: 'Comprehensive guide to hospitality industry',
            link: 'https://www.amazon.com/Introduction-Hospitality-Management-John-Walker/dp/0133762765'
          }
        ],
        courses: [
          {
            title: 'Hospitality Management Certification',
            provider: 'IHM (Institute of Hotel Management)',
            description: 'Professional hospitality management program',
            duration: '2 years',
            isOnline: false,
            link: 'https://www.ihmctan.edu/'
          }
        ],
        colleges: [
          {
            name: 'Institute of Hotel Management',
            location: 'Multiple locations',
            programs: ['Hospitality Management', 'Food Service'],
            description: 'Premier hospitality training institute',
            link: 'https://www.ihmctan.edu/'
          }
        ]
      },
      // Adding new careers for 10th standard
      {
        title: 'Digital Marketing',
        description: 'Learn social media marketing, SEO, content creation, and digital advertising strategies.',
        skills: ['Social Media Marketing', 'SEO', 'Content Creation', 'Analytics'],
        educationRequirements: '10th Standard',
        averageSalary: '₹20,000 - ₹45,000 per month',
        jobOutlook: 'High demand in digital marketing',
        careerTraits: {
          creative: 8,
          analytical: 7,
          communication: 9,
          technical: 7
        },
        books: [
          {
            title: 'Digital Marketing for Beginners',
            author: 'Digital Marketing Institute',
            description: 'Complete guide to digital marketing fundamentals',
            link: 'https://www.amazon.com/Digital-Marketing-Beginners-Guide-Strategies/dp/1234567890'
          }
        ],
        courses: [
          {
            title: 'Digital Marketing Certification',
            provider: 'Google Digital Garage',
            description: 'Free digital marketing certification',
            duration: '3 months',
            isOnline: true,
            link: 'https://learndigital.withgoogle.com/digitalgarage/'
          }
        ],
        colleges: [
          {
            name: 'Digital Marketing Institute',
            location: 'Online',
            programs: ['Digital Marketing', 'Social Media Marketing'],
            description: 'Industry-recognized digital marketing training',
            link: 'https://digitalmarketinginstitute.com/'
          }
        ]
      },
      {
        title: 'Web Development',
        description: 'Learn front-end and back-end web development, including HTML, CSS, JavaScript, and modern frameworks.',
        skills: ['HTML/CSS', 'JavaScript', 'Web Design', 'Problem Solving'],
        educationRequirements: '10th Standard',
        averageSalary: '₹25,000 - ₹60,000 per month',
        jobOutlook: 'Very high demand in IT sector',
        careerTraits: {
          technical: 9,
          creative: 7,
          problemSolving: 9,
          detailOriented: 8
        },
        books: [
          {
            title: 'Web Development Bootcamp',
            author: 'Colt Steele',
            description: 'Complete web development guide',
            link: 'https://www.udemy.com/course/the-web-developer-bootcamp/'
          }
        ],
        courses: [
          {
            title: 'Full Stack Web Development',
            provider: 'freeCodeCamp',
            description: 'Comprehensive web development program',
            duration: '6 months',
            isOnline: true,
            link: 'https://www.freecodecamp.org/'
          }
        ],
        colleges: [
          {
            name: 'Web Development Academy',
            location: 'Online',
            programs: ['Web Development', 'Full Stack Development'],
            description: 'Industry-focused web development training',
            link: 'https://www.w3schools.com/'
          }
        ]
      },
      {
        title: 'Data Entry Operations',
        description: 'Learn data entry, typing, and basic office software operations. Master accuracy and speed in data processing.',
        skills: ['Typing', 'Data Entry', 'MS Office', 'Attention to Detail'],
        educationRequirements: '10th Standard',
        averageSalary: '₹15,000 - ₹30,000 per month',
        jobOutlook: 'Stable demand in various sectors',
        careerTraits: {
          detailOriented: 9,
          technical: 6,
          practical: 8,
          accuracy: 9
        },
        books: [
          {
            title: 'Data Entry Skills',
            author: 'Office Skills Institute',
            description: 'Guide to data entry and office skills',
            link: 'https://www.amazon.com/Data-Entry-Skills-Guide-Professionals/dp/1234567890'
          }
        ],
        courses: [
          {
            title: 'Data Entry Certification',
            provider: 'National Skill Development Corporation',
            description: 'Data entry and office skills training',
            duration: '3 months',
            isOnline: true,
            link: 'https://www.nsdcindia.org/'
          }
        ],
        colleges: [
          {
            name: 'Office Skills Training Center',
            location: 'Multiple locations',
            programs: ['Data Entry', 'Office Operations'],
            description: 'Professional office skills training',
            link: 'https://www.nsdcindia.org/'
          }
        ]
      }
    ],
    '12th': [
      // Technical careers
      {
        title: 'Mechanical Engineering Technology',
        description: 'Learn mechanical systems, design, and manufacturing processes. Master CAD/CAM and industrial automation.',
        skills: ['CAD/CAM', 'Mechanical Design', 'Manufacturing Processes', 'System Analysis'],
        educationRequirements: '12th Standard',
        averageSalary: '₹30,000 - ₹60,000 per month',
        jobOutlook: 'Strong demand in manufacturing and engineering',
        careerTraits: {
          technical: 9,
          analytical: 8,
          problemSolving: 9,
          practical: 9
        },
        books: [
          {
            title: 'Mechanical Engineering Technology',
            author: 'Robert L. Mott',
            description: 'Comprehensive guide to mechanical engineering technology',
            link: 'https://www.amazon.com/Mechanical-Engineering-Technology-Robert-Mott/dp/0135015081'
          }
        ],
        courses: [
          {
            title: 'Diploma in Mechanical Engineering',
            provider: 'Government Polytechnic',
            description: '3-year diploma in mechanical engineering',
            duration: '3 years',
            isOnline: false,
            link: 'https://www.polytechnic.gov.in/'
          }
        ],
        colleges: [
          {
            name: 'Government Polytechnic',
            location: 'Multiple locations',
            programs: ['Mechanical Engineering', 'Manufacturing Technology'],
            description: 'Government-recognized technical education',
            link: 'https://www.polytechnic.gov.in/'
          }
        ]
      },
      // Analytical careers
      {
        title: 'Computer Science Technology',
        description: 'Learn programming, software development, and computer systems. Master web development and database management.',
        skills: ['Programming', 'Web Development', 'Database Management', 'System Analysis'],
        educationRequirements: '12th Standard',
        averageSalary: '₹35,000 - ₹70,000 per month',
        jobOutlook: 'Very high demand in IT sector',
        careerTraits: {
          technical: 9,
          analytical: 9,
          problemSolving: 9,
          logical: 9
        },
        books: [
          {
            title: 'Computer Science: An Overview',
            author: 'J. Glenn Brookshear',
            description: 'Comprehensive guide to computer science fundamentals',
            link: 'https://www.amazon.com/Computer-Science-Overview-Glenn-Brookshear/dp/0133760065'
          }
        ],
        courses: [
          {
            title: 'Diploma in Computer Science',
            provider: 'Government Polytechnic',
            description: '3-year diploma in computer science',
            duration: '3 years',
            isOnline: false,
            link: 'https://www.polytechnic.gov.in/'
          }
        ],
        colleges: [
          {
            name: 'Government Polytechnic',
            location: 'Multiple locations',
            programs: ['Computer Science', 'Information Technology'],
            description: 'Government-recognized technical education',
            link: 'https://www.polytechnic.gov.in/'
          }
        ]
      },
      // Adding new careers for 12th standard
      {
        title: 'Animation and VFX',
        description: 'Learn 2D/3D animation, visual effects, and motion graphics. Master industry-standard software and techniques.',
        skills: ['Animation', 'VFX', 'Motion Graphics', 'Digital Art'],
        educationRequirements: '12th Standard',
        averageSalary: '₹30,000 - ₹70,000 per month',
        jobOutlook: 'Growing demand in entertainment industry',
        careerTraits: {
          creative: 9,
          technical: 8,
          detailOriented: 8,
          artistic: 9
        },
        books: [
          {
            title: 'The Animator\'s Survival Kit',
            author: 'Richard Williams',
            description: 'Essential guide to animation principles',
            link: 'https://www.amazon.com/Animators-Survival-Kit-Principles-Classical/dp/086547897X'
          }
        ],
        courses: [
          {
            title: 'Animation and VFX Diploma',
            provider: 'Arena Animation',
            description: 'Comprehensive animation and VFX program',
            duration: '2 years',
            isOnline: false,
            link: 'https://www.arena-multimedia.com/'
          }
        ],
        colleges: [
          {
            name: 'Arena Animation Academy',
            location: 'Multiple locations',
            programs: ['Animation', 'VFX', 'Motion Graphics'],
            description: 'Industry-leading animation training',
            link: 'https://www.arena-multimedia.com/'
          }
        ]
      },
      {
        title: 'Cybersecurity',
        description: 'Learn network security, ethical hacking, and cybersecurity fundamentals. Master security tools and techniques.',
        skills: ['Network Security', 'Ethical Hacking', 'Security Analysis', 'Problem Solving'],
        educationRequirements: '12th Standard',
        averageSalary: '₹35,000 - ₹80,000 per month',
        jobOutlook: 'Very high demand in IT security',
        careerTraits: {
          technical: 9,
          analytical: 9,
          problemSolving: 9,
          detailOriented: 8
        },
        books: [
          {
            title: 'The Web Application Hacker\'s Handbook',
            author: 'Dafydd Stuttard',
            description: 'Comprehensive guide to web security',
            link: 'https://www.amazon.com/Web-Application-Hackers-Handbook-Exploiting/dp/1118026470'
          }
        ],
        courses: [
          {
            title: 'Cybersecurity Certification',
            provider: 'EC-Council',
            description: 'Certified Ethical Hacker program',
            duration: '6 months',
            isOnline: true,
            link: 'https://www.eccouncil.org/'
          }
        ],
        colleges: [
          {
            name: 'Cybersecurity Training Institute',
            location: 'Multiple locations',
            programs: ['Cybersecurity', 'Ethical Hacking'],
            description: 'Industry-recognized security training',
            link: 'https://www.eccouncil.org/'
          }
        ]
      },
      {
        title: 'Business Analytics',
        description: 'Learn data analysis, business intelligence, and statistical methods. Master tools for business decision-making.',
        skills: ['Data Analysis', 'Business Intelligence', 'Statistics', 'Problem Solving'],
        educationRequirements: '12th Standard',
        averageSalary: '₹30,000 - ₹65,000 per month',
        jobOutlook: 'High demand in business sector',
        careerTraits: {
          analytical: 9,
          technical: 8,
          problemSolving: 8,
          communication: 7
        },
        books: [
          {
            title: 'Business Analytics: Data Analysis & Decision Making',
            author: 'S. Christian Albright',
            description: 'Guide to business analytics',
            link: 'https://www.amazon.com/Business-Analytics-Data-Analysis-Decision/dp/1305948021'
          }
        ],
        courses: [
          {
            title: 'Business Analytics Certification',
            provider: 'IBM',
            description: 'Professional business analytics program',
            duration: '6 months',
            isOnline: true,
            link: 'https://www.ibm.com/'
          }
        ],
        colleges: [
          {
            name: 'Business Analytics Institute',
            location: 'Multiple locations',
            programs: ['Business Analytics', 'Data Analysis'],
            description: 'Industry-focused analytics training',
            link: 'https://www.ibm.com/'
          }
        ]
      }
    ],
    'Graduate': [
      // Technical careers
      {
        title: 'Advanced Manufacturing Technology',
        description: 'Master advanced manufacturing processes, automation, and Industry 4.0 technologies.',
        skills: ['Advanced Manufacturing', 'Automation', 'Process Optimization', 'Quality Management'],
        educationRequirements: 'Graduate Degree',
        averageSalary: '₹45,000 - ₹90,000 per month',
        jobOutlook: 'High demand in advanced manufacturing',
        careerTraits: {
          technical: 9,
          analytical: 9,
          leadership: 8,
          innovation: 8
        },
        books: [
          {
            title: 'Industry 4.0: The Industrial Internet of Things',
            author: 'Alasdair Gilchrist',
            description: 'Guide to advanced manufacturing technologies',
            link: 'https://www.amazon.com/Industry-4-0-Industrial-Internet-Things/dp/1484220465'
          }
        ],
        courses: [
          {
            title: 'Advanced Manufacturing Certification',
            provider: 'IIT (Indian Institute of Technology)',
            description: 'Advanced manufacturing technology program',
            duration: '1 year',
            isOnline: false,
            link: 'https://www.iit.ac.in/'
          }
        ],
        colleges: [
          {
            name: 'IIT Advanced Manufacturing Center',
            location: 'Multiple locations',
            programs: ['Advanced Manufacturing', 'Industry 4.0'],
            description: 'Premier technical education institute',
            link: 'https://www.iit.ac.in/'
          }
        ]
      },
      // Adding new careers for Graduate level
      {
        title: 'Artificial Intelligence',
        description: 'Learn machine learning, deep learning, and AI development. Master cutting-edge AI technologies and applications.',
        skills: ['Machine Learning', 'Deep Learning', 'Python', 'AI Development'],
        educationRequirements: 'Graduate Degree',
        averageSalary: '₹60,000 - ₹1,50,000 per month',
        jobOutlook: 'Very high demand in tech industry',
        careerTraits: {
          technical: 9,
          analytical: 9,
          problemSolving: 9,
          innovation: 9
        },
        books: [
          {
            title: 'Deep Learning',
            author: 'Ian Goodfellow',
            description: 'Comprehensive guide to deep learning',
            link: 'https://www.amazon.com/Deep-Learning-Adaptive-Computation-Machine/dp/0262035618'
          }
        ],
        courses: [
          {
            title: 'AI and Machine Learning',
            provider: 'Google AI',
            description: 'Advanced AI and ML program',
            duration: '1 year',
            isOnline: true,
            link: 'https://ai.google/'
          }
        ],
        colleges: [
          {
            name: 'AI Research Institute',
            location: 'Multiple locations',
            programs: ['AI', 'Machine Learning', 'Deep Learning'],
            description: 'Leading AI research and training',
            link: 'https://ai.google/'
          }
        ]
      },
      {
        title: 'Blockchain Development',
        description: 'Learn blockchain technology, smart contracts, and decentralized applications. Master cryptocurrency and blockchain platforms.',
        skills: ['Blockchain', 'Smart Contracts', 'Cryptography', 'DApp Development'],
        educationRequirements: 'Graduate Degree',
        averageSalary: '₹70,000 - ₹1,80,000 per month',
        jobOutlook: 'High demand in fintech sector',
        careerTraits: {
          technical: 9,
          analytical: 9,
          innovation: 9,
          problemSolving: 9
        },
        books: [
          {
            title: 'Mastering Blockchain',
            author: 'Imran Bashir',
            description: 'Complete guide to blockchain technology',
            link: 'https://www.amazon.com/Mastering-Blockchain-Distributed-Cryptocurrency-Applications/dp/1839213198'
          }
        ],
        courses: [
          {
            title: 'Blockchain Development',
            provider: 'Ethereum Foundation',
            description: 'Professional blockchain development program',
            duration: '1 year',
            isOnline: true,
            link: 'https://ethereum.org/'
          }
        ],
        colleges: [
          {
            name: 'Blockchain Academy',
            location: 'Multiple locations',
            programs: ['Blockchain Development', 'Smart Contracts'],
            description: 'Industry-leading blockchain training',
            link: 'https://ethereum.org/'
          }
        ]
      },
      {
        title: 'Cloud Architecture',
        description: 'Learn cloud computing, infrastructure design, and cloud security. Master AWS, Azure, and Google Cloud platforms.',
        skills: ['Cloud Computing', 'Infrastructure Design', 'DevOps', 'Security'],
        educationRequirements: 'Graduate Degree',
        averageSalary: '₹80,000 - ₹2,00,000 per month',
        jobOutlook: 'Very high demand in cloud sector',
        careerTraits: {
          technical: 9,
          analytical: 8,
          problemSolving: 9,
          leadership: 8
        },
        books: [
          {
            title: 'Cloud Architecture Patterns',
            author: 'Martin Fowler',
            description: 'Guide to cloud architecture design',
            link: 'https://www.amazon.com/Cloud-Architecture-Patterns-Martin-Fowler/dp/1234567890'
          }
        ],
        courses: [
          {
            title: 'Cloud Architecture Certification',
            provider: 'AWS',
            description: 'Professional cloud architecture program',
            duration: '1 year',
            isOnline: true,
            link: 'https://aws.amazon.com/'
          }
        ],
        colleges: [
          {
            name: 'Cloud Computing Institute',
            location: 'Multiple locations',
            programs: ['Cloud Architecture', 'DevOps'],
            description: 'Industry-recognized cloud training',
            link: 'https://aws.amazon.com/'
          }
        ]
      }
    ]
  };

  // Get default careers based on education level
  const educationDefaults = defaultCareers[educationLevel] || defaultCareers['Graduate'];

  // If no score patterns are available, return default careers for the education level
  if (!scorePatterns || Object.keys(scorePatterns).length === 0) {
    return educationDefaults.slice(0, 3); // Return top 3 default careers
  }

  // Select careers based on dominant score pattern
  const dominantPattern = Object.entries(scorePatterns)
    .sort((a, b) => b[1] - a[1])[0][0];

  // Filter careers based on dominant pattern
  const filteredCareers = educationDefaults.filter(career => 
    career.careerTraits[dominantPattern] > 7
  );

  // If no careers match the pattern, return default careers
  if (filteredCareers.length === 0) {
    // Get default careers based on education level
    const defaultOptions = {
      '10th': [
        {
          title: 'General Vocational Training',
          description: 'Explore various vocational skills and trades. Choose from multiple career paths based on your interests.',
          skills: ['Basic Technical Skills', 'Practical Learning', 'Hands-on Training', 'Safety Awareness'],
          educationRequirements: '10th Standard',
          averageSalary: '₹15,000 - ₹30,000 per month',
          jobOutlook: 'Good demand for skilled workers',
          careerTraits: {
            practical: 8,
            technical: 7,
            problemSolving: 7,
            adaptability: 8
          },
          books: [
            {
              title: 'Vocational Education and Training',
              author: 'Skills Development Council',
              description: 'Guide to vocational training opportunities',
              link: 'https://www.skillindia.gov.in/'
            }
          ],
          courses: [
            {
              title: 'Basic Vocational Skills',
              provider: 'ITI (Industrial Training Institute)',
              description: 'Foundation course in vocational skills',
              duration: '1 year',
              isOnline: false,
              link: 'https://iti.gov.in/'
            }
          ],
          colleges: [
            {
              name: 'Government ITI',
              location: 'Multiple locations',
              programs: ['Vocational Training', 'Skill Development'],
              description: 'Government-certified vocational training',
              link: 'https://iti.gov.in/'
            }
          ]
        }
      ],
      '12th': [
        {
          title: 'General Diploma Programs',
          description: 'Explore various diploma programs in technical and professional fields. Choose based on your interests and aptitude.',
          skills: ['Technical Knowledge', 'Professional Skills', 'Problem Solving', 'Communication'],
          educationRequirements: '12th Standard',
          averageSalary: '₹25,000 - ₹45,000 per month',
          jobOutlook: 'Good demand for diploma holders',
          careerTraits: {
            technical: 8,
            analytical: 7,
            practical: 8,
            professional: 8
          },
          books: [
            {
              title: 'Career Guide for Diploma Holders',
              author: 'Technical Education Board',
              description: 'Comprehensive guide to diploma programs',
              link: 'https://www.polytechnic.gov.in/'
            }
          ],
          courses: [
            {
              title: 'General Diploma Program',
              provider: 'Government Polytechnic',
              description: 'Foundation course in technical education',
              duration: '3 years',
              isOnline: false,
              link: 'https://www.polytechnic.gov.in/'
            }
          ],
          colleges: [
            {
              name: 'Government Polytechnic',
              location: 'Multiple locations',
              programs: ['Technical Education', 'Professional Training'],
              description: 'Government-recognized technical education',
              link: 'https://www.polytechnic.gov.in/'
            }
          ]
        }
      ],
      'Graduate': [
        {
          title: 'Professional Certification Programs',
          description: 'Explore professional certification programs in various fields. Enhance your skills and career prospects.',
          skills: ['Professional Skills', 'Industry Knowledge', 'Leadership', 'Problem Solving'],
          educationRequirements: 'Graduate Degree',
          averageSalary: '₹40,000 - ₹80,000 per month',
          jobOutlook: 'High demand for certified professionals',
          careerTraits: {
            professional: 9,
            leadership: 8,
            analytical: 8,
            communication: 8
          },
          books: [
            {
              title: 'Professional Development Guide',
              author: 'Career Development Institute',
              description: 'Guide to professional certifications',
              link: 'https://www.careerindia.com/'
            }
          ],
          courses: [
            {
              title: 'Professional Certification',
              provider: 'Industry Training Institute',
              description: 'Advanced professional certification program',
              duration: '1 year',
              isOnline: false,
              link: 'https://www.industrytraining.in/'
            }
          ],
          colleges: [
            {
              name: 'Professional Training Institute',
              location: 'Multiple locations',
              programs: ['Professional Development', 'Industry Training'],
              description: 'Industry-recognized professional training',
              link: 'https://www.industrytraining.in/'
            }
          ]
        }
      ]
    };

    return defaultOptions[educationLevel] || defaultOptions['Graduate'];
  }

  return filteredCareers;
}; 