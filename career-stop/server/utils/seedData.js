const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Career = require('../models/Career');
const Question = require('../models/Question');

// Load environment variables
dotenv.config();

// Generate 40 psychometric test questions
const generateTestQuestions = () => {
  const categories = ['interests', 'personality', 'skills', 'values'];
  const questions = [];
  
  // Interest-related questions
  const interestQuestions = [
    'Do you enjoy solving complex problems or puzzles?',
    'Are you interested in how machines or technology work?',
    'Do you like helping people or taking care of others?',
    'Are you passionate about art, design, or creativity?',
    'Do you like writing stories, articles, or expressing yourself through words?',
    'Do you enjoy working with numbers, data, or statistics?',
    'Are you fascinated by space, science, or the natural world?',
    'Do you enjoy leading a team or organizing activities?',
    'Are you interested in starting your own business someday?',
    'Do you enjoy teaching or explaining things to others?'
  ];
  
  // Personality-related questions
  const personalityQuestions = [
    'Do you prefer working in a structured, rule-based environment?',
    'Are you comfortable taking risks or making decisions independently?',
    'Do you enjoy interacting with new people regularly?',
    'Do you prefer working alone rather than in a team?',
    'Are you someone who pays close attention to small details?',
    'Do you often come up with creative or out-of-the-box ideas?',
    'Are you good at handling pressure or deadlines?',
    'Do you consider yourself more logical or emotional in decision-making?',
    'Are you self-motivated and disciplined without supervision?',
    'Do you enjoy being in leadership positions?'
  ];
  
  // Skills-related questions
  const skillQuestions = [
    'Are you good at math and logical reasoning?',
    'Can you express your ideas clearly through writing or speaking?',
    'Do you have good hand-eye coordination?',
    'Are you good at organizing events or managing time?',
    'Can you easily learn new technologies or software?',
    'Are you skilled in drawing, painting, or other visual arts?',
    'Do you have a knack for understanding human emotions or behavior?',
    'Are you fluent in multiple languages?',
    'Do you enjoy coding or building things online?',
    'Can you repair or fix things like electronics or appliances?'
  ];

  // Values & Lifestyle questions
  const valuesQuestions = [
    'Is job security important to you?',
    'Would you prefer a high-paying job even if it\'s stressful?',
    'Do you want a career that allows you to help society?',
    'Is work-life balance more important than rapid career growth?',
    'Do you want a job that involves travel?',
    'Would you prefer a flexible work schedule or fixed 9-to-5?',
    'Is it important for your career to have respect and social status?',
    'Do you want to work in a city, rural area, or remote setting?',
    'Are you okay with routine work, or do you need variety every day?',
    'Do you see yourself working for others or being your own boss?'
  ];
  
  // Options for each category
  const optionsByCategory = {
    interests: [
      [
        { text: 'Strongly Disagree', score: new Map([['analytical', 1], ['creative', 1], ['social', 1]]) },
        { text: 'Disagree', score: new Map([['analytical', 2], ['creative', 2], ['social', 2]]) },
        { text: 'Neutral', score: new Map([['analytical', 3], ['creative', 3], ['social', 3]]) },
        { text: 'Agree', score: new Map([['analytical', 4], ['creative', 4], ['social', 4]]) },
        { text: 'Strongly Agree', score: new Map([['analytical', 5], ['creative', 5], ['social', 5]]) }
      ]
    ],
    personality: [
      [
        { text: 'Strongly Disagree', score: new Map([['structured', 1], ['independent', 1], ['teamwork', 1]]) },
        { text: 'Disagree', score: new Map([['structured', 2], ['independent', 2], ['teamwork', 2]]) },
        { text: 'Neutral', score: new Map([['structured', 3], ['independent', 3], ['teamwork', 3]]) },
        { text: 'Agree', score: new Map([['structured', 4], ['independent', 4], ['teamwork', 4]]) },
        { text: 'Strongly Agree', score: new Map([['structured', 5], ['independent', 5], ['teamwork', 5]]) }
      ]
    ],
    skills: [
      [
        { text: 'Strongly Disagree', score: new Map([['technical', 1], ['communication', 1], ['creative', 1]]) },
        { text: 'Disagree', score: new Map([['technical', 2], ['communication', 2], ['creative', 2]]) },
        { text: 'Neutral', score: new Map([['technical', 3], ['communication', 3], ['creative', 3]]) },
        { text: 'Agree', score: new Map([['technical', 4], ['communication', 4], ['creative', 4]]) },
        { text: 'Strongly Agree', score: new Map([['technical', 5], ['communication', 5], ['creative', 5]]) }
      ]
    ],
    values: [
      [
        { text: 'Strongly Disagree', score: new Map([['security', 1], ['growth', 1], ['balance', 1]]) },
        { text: 'Disagree', score: new Map([['security', 2], ['growth', 2], ['balance', 2]]) },
        { text: 'Neutral', score: new Map([['security', 3], ['growth', 3], ['balance', 3]]) },
        { text: 'Agree', score: new Map([['security', 4], ['growth', 4], ['balance', 4]]) },
        { text: 'Strongly Agree', score: new Map([['security', 5], ['growth', 5], ['balance', 5]]) }
      ]
    ]
  };
  
  // Generate 40 questions with appropriate options
  for (let i = 0; i < 40; i++) {
    const categoryIndex = i % 4; // Evenly distribute categories
    const category = categories[categoryIndex];
    
    // Select a question from the appropriate category
    const questionPool = {
      interests: interestQuestions,
      personality: personalityQuestions,
      skills: skillQuestions,
      values: valuesQuestions
    }[category];
    
    const questionText = questionPool[i % questionPool.length];
    
    // Select options for this question
    const optionsPool = optionsByCategory[category];
    const options = optionsPool[i % optionsPool.length];
    
    // Create the question object
    questions.push({
      text: questionText,
      category: category,
      options: options,
      active: true
    });
  }
  
  return questions;
};

// Add educational level selection
const educationalLevels = [
  {
    level: '10th',
    description: 'Currently in or completed 10th grade',
    streams: ['Science', 'Commerce', 'Arts', 'Vocational']
  },
  {
    level: '12th',
    description: 'Currently in or completed 12th grade',
    streams: ['Science (PCM)', 'Science (PCB)', 'Commerce', 'Arts/Humanities']
  },
  {
    level: 'Graduate',
    description: 'Completed undergraduate degree',
    streams: ['Engineering', 'Medical', 'Commerce', 'Arts', 'Other']
  }
];

// Sample psychometric test questions
const questions = generateTestQuestions();

// Import data into DB
const importData = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await Career.deleteMany();
    await Question.deleteMany();
    
    // Generate questions
    const questions = generateTestQuestions();
    
    // Import new data
    await Question.insertMany(questions);
    
    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run the import if this file is run directly
if (require.main === module) {
  importData();
}

module.exports = {
  importData,
  generateTestQuestions
};

// Sample career data
const careers = [
  // Science Stream Careers
  {
    title: 'Software Engineer',
    description: 'Software engineers design, develop, and maintain software applications and systems.',
    skills: ['Programming', 'Problem Solving', 'Software Design', 'Debugging', 'Teamwork'],
    education: 'B.Tech/BE in Computer Science or related field',
    averageSalary: '₹6,00,000 - ₹15,00,000 per year',
    jobOutlook: 'Growing much faster than average (22% growth from 2020-2030)',
    careerTraits: {
      analytical: 9,
      creative: 8,
      technical: 9,
      teamwork: 7,
      communication: 7,
      problemSolving: 9
    },
    books: [
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        link: 'https://example.com/clean-code',
        description: 'A handbook of agile software craftsmanship.'
      },
      {
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt and David Thomas',
        link: 'https://example.com/pragmatic-programmer',
        description: 'Your journey to mastery.'
      },
      {
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        link: 'https://example.com/algorithms',
        description: 'Comprehensive guide to algorithms and data structures.'
      }
    ],
    courses: [
      {
        title: 'Full Stack Web Development',
        provider: 'Coursera',
        link: 'https://example.com/fullstack',
        description: 'Complete web development course',
        isOnline: true
      },
      {
        title: 'Data Structures and Algorithms',
        provider: 'Udemy',
        link: 'https://example.com/dsa',
        description: 'Advanced programming concepts',
        isOnline: true
      },
      {
        title: 'Machine Learning Specialization',
        provider: 'Stanford Online',
        link: 'https://example.com/ml',
        description: 'Comprehensive machine learning course',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'Indian Institute of Technology (IIT)',
        location: 'Multiple Locations',
        programs: ['B.Tech in Computer Science', 'M.Tech in Software Engineering'],
        link: 'https://example.com/iit',
        description: 'Premier technical education institution'
      },
      {
        name: 'National Institute of Technology (NIT)',
        location: 'Multiple Locations',
        programs: ['B.Tech in Computer Science', 'M.Tech in Software Systems'],
        link: 'https://example.com/nit',
        description: 'Leading technical education institution'
      },
      {
        name: 'BITS Pilani',
        location: 'Pilani, Rajasthan',
        programs: ['B.E. Computer Science', 'M.E. Software Systems'],
        link: 'https://example.com/bits',
        description: 'Top private technical university'
      }
    ],
    articles: [
      {
        title: 'Future of Software Development',
        author: 'Tech Review',
        link: 'https://example.com/software-future',
        description: 'Emerging trends in software development',
        publishedDate: new Date('2023-06-15')
      },
      {
        title: 'Software Development Best Practices',
        author: 'Developer Weekly',
        link: 'https://example.com/dev-practices',
        description: 'Essential practices for modern developers',
        publishedDate: new Date('2023-07-20')
      },
      {
        title: 'AI in Software Development',
        author: 'AI Today',
        link: 'https://example.com/ai-dev',
        description: 'Impact of AI on software development',
        publishedDate: new Date('2023-08-10')
      }
    ]
  },
  {
    title: 'Medical Doctor (MBBS)',
    description: 'Medical doctors diagnose and treat patients\' illnesses and injuries.',
    skills: ['Medical Knowledge', 'Patient Care', 'Diagnosis', 'Communication', 'Problem Solving'],
    education: 'MBBS from recognized medical college',
    averageSalary: '₹8,00,000 - ₹25,00,000 per year',
    jobOutlook: 'Growing faster than average (15% growth from 2020-2030)',
    careerTraits: {
      analytical: 9,
      empathy: 9,
      technical: 8,
      communication: 9,
      problemSolving: 9,
      attentionToDetail: 9
    },
    books: [
      {
        title: 'Gray\'s Anatomy',
        author: 'Henry Gray',
        link: 'https://example.com/grays-anatomy',
        description: 'Comprehensive guide to human anatomy.'
      },
      {
        title: 'Harrison\'s Principles of Internal Medicine',
        author: 'Dennis L. Kasper',
        link: 'https://example.com/harrisons',
        description: 'Essential medical textbook.'
      },
      {
        title: 'Robbins Basic Pathology',
        author: 'Vinay Kumar',
        link: 'https://example.com/robbins',
        description: 'Fundamental pathology textbook.'
      }
    ],
    courses: [
      {
        title: 'NEET Preparation',
        provider: 'Aakash Institute',
        link: 'https://example.com/neet',
        description: 'Comprehensive NEET exam preparation',
        isOnline: false
      },
      {
        title: 'Medical Ethics',
        provider: 'Harvard Medical School',
        link: 'https://example.com/ethics',
        description: 'Professional ethics in medicine',
        isOnline: true
      },
      {
        title: 'Clinical Skills',
        provider: 'Johns Hopkins',
        link: 'https://example.com/clinical',
        description: 'Essential clinical skills training',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'All India Institute of Medical Sciences (AIIMS)',
        location: 'New Delhi',
        programs: ['MBBS', 'MD', 'MS'],
        link: 'https://example.com/aiims',
        description: 'Premier medical institution'
      },
      {
        name: 'Christian Medical College (CMC)',
        location: 'Vellore',
        programs: ['MBBS', 'MD', 'MS'],
        link: 'https://example.com/cmc',
        description: 'Leading private medical college'
      },
      {
        name: 'Maulana Azad Medical College',
        location: 'New Delhi',
        programs: ['MBBS', 'MD', 'MS'],
        link: 'https://example.com/mamc',
        description: 'Top government medical college'
      }
    ],
    articles: [
      {
        title: 'Future of Medical Practice',
        author: 'Medical Journal',
        link: 'https://example.com/medical-future',
        description: 'Emerging trends in medical practice',
        publishedDate: new Date('2023-06-20')
      },
      {
        title: 'Medical Ethics in Modern Practice',
        author: 'Healthcare Review',
        link: 'https://example.com/medical-ethics',
        description: 'Ethical considerations in modern medicine',
        publishedDate: new Date('2023-07-25')
      },
      {
        title: 'Technology in Healthcare',
        author: 'Health Tech',
        link: 'https://example.com/health-tech',
        description: 'Impact of technology on healthcare',
        publishedDate: new Date('2023-08-15')
      }
    ]
  },
  // Commerce Stream Careers
  {
    title: 'Chartered Accountant (CA)',
    description: 'Chartered Accountants provide financial advice, audit services, and tax planning.',
    skills: ['Accounting', 'Taxation', 'Auditing', 'Financial Analysis', 'Business Law'],
    education: 'CA qualification from ICAI',
    averageSalary: '₹7,00,000 - ₹20,00,000 per year',
    jobOutlook: 'Growing as fast as average (10% growth from 2020-2030)',
    careerTraits: {
      analytical: 9,
      detailOriented: 9,
      ethical: 9,
      communication: 8,
      problemSolving: 8,
      organization: 9
    },
    books: [
      {
        title: 'Advanced Financial Accounting',
        author: 'ICAI',
        link: 'https://example.com/financial-accounting',
        description: 'Comprehensive guide to financial accounting.'
      },
      {
        title: 'Taxation Laws',
        author: 'ICAI',
        link: 'https://example.com/taxation',
        description: 'Complete guide to Indian taxation.'
      },
      {
        title: 'Auditing and Assurance',
        author: 'ICAI',
        link: 'https://example.com/auditing',
        description: 'Professional auditing standards and practices.'
      }
    ],
    courses: [
      {
        title: 'CA Foundation',
        provider: 'ICAI',
        link: 'https://example.com/ca-foundation',
        description: 'Entry level CA course',
        isOnline: true
      },
      {
        title: 'CA Intermediate',
        provider: 'ICAI',
        link: 'https://example.com/ca-intermediate',
        description: 'Intermediate level CA course',
        isOnline: true
      },
      {
        title: 'CA Final',
        provider: 'ICAI',
        link: 'https://example.com/ca-final',
        description: 'Final level CA course',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'Institute of Chartered Accountants of India (ICAI)',
        location: 'Multiple Locations',
        programs: ['CA Foundation', 'CA Intermediate', 'CA Final'],
        link: 'https://example.com/icai',
        description: 'Premier accounting body'
      },
      {
        name: 'Delhi School of Professional Studies',
        location: 'Delhi',
        programs: ['CA Coaching', 'CS Coaching'],
        link: 'https://example.com/dsps',
        description: 'Leading CA coaching institute'
      },
      {
        name: 'Vidya Sagar Institute',
        location: 'Delhi',
        programs: ['CA Coaching', 'CS Coaching'],
        link: 'https://example.com/vsi',
        description: 'Top CA coaching center'
      }
    ],
    articles: [
      {
        title: 'Future of Accounting',
        author: 'Finance Today',
        link: 'https://example.com/accounting-future',
        description: 'Emerging trends in accounting',
        publishedDate: new Date('2023-06-25')
      },
      {
        title: 'Digital Transformation in Finance',
        author: 'Financial Review',
        link: 'https://example.com/digital-finance',
        description: 'Impact of technology on finance',
        publishedDate: new Date('2023-07-30')
      },
      {
        title: 'Tax Reforms in India',
        author: 'Tax Journal',
        link: 'https://example.com/tax-reforms',
        description: 'Recent changes in tax laws',
        publishedDate: new Date('2023-08-20')
      }
    ]
  },
  {
    title: 'Civil Engineer',
    description: 'Civil engineers design, construct, and maintain infrastructure projects like roads, buildings, and bridges.',
    skills: ['Structural Design', 'Project Management', 'AutoCAD', 'Construction Planning', 'Site Analysis'],
    education: 'B.Tech/BE in Civil Engineering',
    averageSalary: '₹5,00,000 - ₹15,00,000 per year',
    jobOutlook: 'Growing as fast as average (8% growth from 2020-2030)',
    careerTraits: {
      analytical: 9,
      technical: 9,
      projectManagement: 8,
      problemSolving: 9,
      attentionToDetail: 9,
      communication: 7
    },
    books: [
      {
        title: 'Civil Engineering Materials',
        author: 'Peter A. Claisse',
        link: 'https://example.com/civil-materials',
        description: 'Comprehensive guide to construction materials.'
      },
      {
        title: 'Structural Analysis',
        author: 'R.C. Hibbeler',
        link: 'https://example.com/structural-analysis',
        description: 'Advanced structural engineering concepts.'
      },
      {
        title: 'Construction Project Management',
        author: 'S. Keoki Sears',
        link: 'https://example.com/construction-pm',
        description: 'Project management in construction.'
      }
    ],
    courses: [
      {
        title: 'Structural Engineering',
        provider: 'IIT Madras',
        link: 'https://example.com/structural-eng',
        description: 'Advanced structural engineering concepts',
        isOnline: true
      },
      {
        title: 'AutoCAD for Civil Engineers',
        provider: 'Udemy',
        link: 'https://example.com/autocad-civil',
        description: 'CAD software for civil engineering',
        isOnline: true
      },
      {
        title: 'Construction Management',
        provider: 'NPTEL',
        link: 'https://example.com/construction-mgmt',
        description: 'Project management in construction',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'Indian Institute of Technology (IIT)',
        location: 'Multiple Locations',
        programs: ['B.Tech in Civil Engineering', 'M.Tech in Structural Engineering'],
        link: 'https://example.com/iit-civil',
        description: 'Premier technical education institution'
      },
      {
        name: 'National Institute of Technology (NIT)',
        location: 'Multiple Locations',
        programs: ['B.Tech in Civil Engineering', 'M.Tech in Construction Technology'],
        link: 'https://example.com/nit-civil',
        description: 'Leading technical education institution'
      },
      {
        name: 'College of Engineering, Pune',
        location: 'Pune',
        programs: ['B.E. Civil Engineering', 'M.E. Structural Engineering'],
        link: 'https://example.com/coep',
        description: 'Top government engineering college'
      }
    ],
    articles: [
      {
        title: 'Sustainable Construction',
        author: 'Engineering Review',
        link: 'https://example.com/sustainable-construction',
        description: 'Green building practices in civil engineering',
        publishedDate: new Date('2023-06-30')
      },
      {
        title: 'Smart Infrastructure',
        author: 'Civil Engineering Today',
        link: 'https://example.com/smart-infrastructure',
        description: 'Technology in modern infrastructure',
        publishedDate: new Date('2023-07-25')
      },
      {
        title: 'Future of Civil Engineering',
        author: 'Construction Weekly',
        link: 'https://example.com/civil-future',
        description: 'Emerging trends in civil engineering',
        publishedDate: new Date('2023-08-25')
      }
    ]
  },
  {
    title: 'Data Scientist',
    description: 'Data scientists analyze complex data sets to help guide business decisions.',
    skills: ['Python', 'Machine Learning', 'Statistical Analysis', 'Data Visualization', 'SQL'],
    education: 'B.Tech/BE in Computer Science or related field with specialization in Data Science',
    averageSalary: '₹8,00,000 - ₹25,00,000 per year',
    jobOutlook: 'Growing much faster than average (31% growth from 2020-2030)',
    careerTraits: {
      analytical: 9,
      technical: 9,
      problemSolving: 9,
      communication: 8,
      creativity: 8,
      attentionToDetail: 9
    },
    books: [
      {
        title: 'Introduction to Statistical Learning',
        author: 'Gareth James',
        link: 'https://example.com/statistical-learning',
        description: 'Fundamental concepts in statistical learning.'
      },
      {
        title: 'Python for Data Analysis',
        author: 'Wes McKinney',
        link: 'https://example.com/python-data',
        description: 'Data analysis with Python.'
      },
      {
        title: 'Deep Learning',
        author: 'Ian Goodfellow',
        link: 'https://example.com/deep-learning',
        description: 'Comprehensive guide to deep learning.'
      }
    ],
    courses: [
      {
        title: 'Machine Learning Specialization',
        provider: 'Stanford Online',
        link: 'https://example.com/ml-stanford',
        description: 'Comprehensive machine learning course',
        isOnline: true
      },
      {
        title: 'Data Science Professional',
        provider: 'IBM',
        link: 'https://example.com/ibm-ds',
        description: 'Professional data science certification',
        isOnline: true
      },
      {
        title: 'Deep Learning Specialization',
        provider: 'deeplearning.ai',
        link: 'https://example.com/dl-specialization',
        description: 'Advanced deep learning concepts',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'Indian Institute of Technology (IIT)',
        location: 'Multiple Locations',
        programs: ['B.Tech in Computer Science', 'M.Tech in Data Science'],
        link: 'https://example.com/iit-ds',
        description: 'Premier technical education institution'
      },
      {
        name: 'Indian Statistical Institute',
        location: 'Multiple Locations',
        programs: ['M.Tech in Computer Science', 'M.Stat in Data Science'],
        link: 'https://example.com/isi',
        description: 'Leading statistics and data science institution'
      },
      {
        name: 'International Institute of Information Technology',
        location: 'Hyderabad',
        programs: ['M.Tech in Data Science', 'MS in Data Science'],
        link: 'https://example.com/iiit',
        description: 'Specialized in information technology'
      }
    ],
    articles: [
      {
        title: 'AI and Machine Learning Trends',
        author: 'Data Science Review',
        link: 'https://example.com/ai-trends',
        description: 'Latest developments in AI and ML',
        publishedDate: new Date('2023-07-01')
      },
      {
        title: 'Big Data Analytics',
        author: 'Tech Journal',
        link: 'https://example.com/big-data',
        description: 'Advanced analytics techniques',
        publishedDate: new Date('2023-08-01')
      },
      {
        title: 'Data Science in Business',
        author: 'Business Analytics Today',
        link: 'https://example.com/ds-business',
        description: 'Applications of data science in business',
        publishedDate: new Date('2023-09-01')
      }
    ]
  },
  {
    title: 'Company Secretary (CS)',
    description: 'Company Secretaries ensure corporate compliance and governance in organizations.',
    skills: ['Corporate Law', 'Compliance', 'Corporate Governance', 'Legal Documentation', 'Board Management'],
    education: 'CS qualification from ICSI',
    averageSalary: '₹6,00,000 - ₹18,00,000 per year',
    jobOutlook: 'Growing as fast as average (9% growth from 2020-2030)',
    careerTraits: {
      analytical: 8,
      detailOriented: 9,
      ethical: 9,
      communication: 9,
      organization: 9,
      problemSolving: 8
    },
    books: [
      {
        title: 'Company Law',
        author: 'ICSI',
        link: 'https://example.com/company-law',
        description: 'Comprehensive guide to company law.'
      },
      {
        title: 'Corporate Governance',
        author: 'ICSI',
        link: 'https://example.com/corporate-gov',
        description: 'Principles of corporate governance.'
      },
      {
        title: 'Securities Laws',
        author: 'ICSI',
        link: 'https://example.com/securities-law',
        description: 'Guide to securities regulations.'
      }
    ],
    courses: [
      {
        title: 'CS Foundation',
        provider: 'ICSI',
        link: 'https://example.com/cs-foundation',
        description: 'Entry level CS course',
        isOnline: true
      },
      {
        title: 'CS Executive',
        provider: 'ICSI',
        link: 'https://example.com/cs-executive',
        description: 'Intermediate level CS course',
        isOnline: true
      },
      {
        title: 'CS Professional',
        provider: 'ICSI',
        link: 'https://example.com/cs-professional',
        description: 'Final level CS course',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'Institute of Company Secretaries of India (ICSI)',
        location: 'Multiple Locations',
        programs: ['CS Foundation', 'CS Executive', 'CS Professional'],
        link: 'https://example.com/icsi',
        description: 'Premier body for company secretaries'
      },
      {
        name: 'Delhi School of Professional Studies',
        location: 'Delhi',
        programs: ['CS Coaching', 'CA Coaching'],
        link: 'https://example.com/dsps-cs',
        description: 'Leading CS coaching institute'
      },
      {
        name: 'Vidya Sagar Institute',
        location: 'Delhi',
        programs: ['CS Coaching', 'CA Coaching'],
        link: 'https://example.com/vsi-cs',
        description: 'Top CS coaching center'
      }
    ],
    articles: [
      {
        title: 'Corporate Governance Trends',
        author: 'Corporate Review',
        link: 'https://example.com/gov-trends',
        description: 'Latest trends in corporate governance',
        publishedDate: new Date('2023-07-05')
      },
      {
        title: 'Compliance in Digital Age',
        author: 'Legal Tech',
        link: 'https://example.com/digital-compliance',
        description: 'Technology in corporate compliance',
        publishedDate: new Date('2023-08-05')
      },
      {
        title: 'Future of Company Secretaries',
        author: 'CS Journal',
        link: 'https://example.com/cs-future',
        description: 'Evolving role of company secretaries',
        publishedDate: new Date('2023-09-05')
      }
    ]
  },
  {
    title: 'Mechanical Engineer',
    description: 'Mechanical engineers design, develop, and test mechanical devices, engines, and machines.',
    skills: ['CAD/CAM', 'Thermodynamics', 'Fluid Mechanics', 'Machine Design', 'Manufacturing Processes'],
    education: 'B.Tech/BE in Mechanical Engineering',
    averageSalary: '₹5,00,000 - ₹15,00,000 per year',
    jobOutlook: 'Growing as fast as average (7% growth from 2020-2030)',
    careerTraits: {
      analytical: 9,
      technical: 9,
      problemSolving: 9,
      creativity: 8,
      attentionToDetail: 9,
      communication: 7
    },
    books: [
      {
        title: 'Mechanical Engineering Design',
        author: 'Joseph E. Shigley',
        link: 'https://example.com/mech-design',
        description: 'Comprehensive guide to mechanical design.'
      },
      {
        title: 'Thermodynamics: An Engineering Approach',
        author: 'Yunus A. Cengel',
        link: 'https://example.com/thermodynamics',
        description: 'Advanced thermodynamics concepts.'
      },
      {
        title: 'Manufacturing Processes',
        author: 'Serope Kalpakjian',
        link: 'https://example.com/manufacturing',
        description: 'Guide to manufacturing processes.'
      }
    ],
    courses: [
      {
        title: 'Advanced CAD/CAM',
        provider: 'IIT Bombay',
        link: 'https://example.com/cad-cam',
        description: 'Advanced computer-aided design and manufacturing',
        isOnline: true
      },
      {
        title: 'Finite Element Analysis',
        provider: 'NPTEL',
        link: 'https://example.com/fea',
        description: 'Computer-aided engineering analysis',
        isOnline: true
      },
      {
        title: 'Robotics and Automation',
        provider: 'MIT OpenCourseWare',
        link: 'https://example.com/robotics',
        description: 'Modern manufacturing automation',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'Indian Institute of Technology (IIT)',
        location: 'Multiple Locations',
        programs: ['B.Tech in Mechanical Engineering', 'M.Tech in Manufacturing'],
        link: 'https://example.com/iit-mech',
        description: 'Premier technical education institution'
      },
      {
        name: 'National Institute of Technology (NIT)',
        location: 'Multiple Locations',
        programs: ['B.Tech in Mechanical Engineering', 'M.Tech in Thermal Engineering'],
        link: 'https://example.com/nit-mech',
        description: 'Leading technical education institution'
      },
      {
        name: 'PSG College of Technology',
        location: 'Coimbatore',
        programs: ['B.E. Mechanical Engineering', 'M.E. Manufacturing Engineering'],
        link: 'https://example.com/psg',
        description: 'Top private engineering college'
      }
    ],
    articles: [
      {
        title: 'Industry 4.0 in Manufacturing',
        author: 'Manufacturing Today',
        link: 'https://example.com/industry-4',
        description: 'Smart manufacturing trends',
        publishedDate: new Date('2023-07-10')
      },
      {
        title: 'Sustainable Engineering',
        author: 'Engineering Review',
        link: 'https://example.com/sustainable-eng',
        description: 'Green manufacturing practices',
        publishedDate: new Date('2023-08-10')
      },
      {
        title: 'Future of Mechanical Engineering',
        author: 'Mech Engineering Journal',
        link: 'https://example.com/mech-future',
        description: 'Emerging trends in mechanical engineering',
        publishedDate: new Date('2023-09-10')
      }
    ]
  },
  {
    title: 'Lawyer',
    description: 'Lawyers provide legal advice and representation to clients in various legal matters.',
    skills: ['Legal Research', 'Case Analysis', 'Client Counseling', 'Document Drafting', 'Court Representation'],
    education: 'LLB from recognized law school',
    averageSalary: '₹7,00,000 - ₹25,00,000 per year',
    jobOutlook: 'Growing as fast as average (9% growth from 2020-2030)',
    careerTraits: {
      analytical: 9,
      communication: 9,
      research: 9,
      problemSolving: 9,
      attentionToDetail: 9,
      ethical: 9
    },
    books: [
      {
        title: 'Constitutional Law of India',
        author: 'M.P. Jain',
        link: 'https://example.com/constitutional-law',
        description: 'Comprehensive guide to Indian constitutional law.'
      },
      {
        title: 'Indian Penal Code',
        author: 'Ratanlal & Dhirajlal',
        link: 'https://example.com/ipc',
        description: 'Guide to criminal law in India.'
      },
      {
        title: 'Contract Law',
        author: 'Avtar Singh',
        link: 'https://example.com/contract-law',
        description: 'Principles of contract law.'
      }
    ],
    courses: [
      {
        title: 'Corporate Law',
        provider: 'National Law School',
        link: 'https://example.com/corporate-law',
        description: 'Advanced corporate law concepts',
        isOnline: true
      },
      {
        title: 'Criminal Law Practice',
        provider: 'Bar Council of India',
        link: 'https://example.com/criminal-law',
        description: 'Practical criminal law training',
        isOnline: true
      },
      {
        title: 'Intellectual Property Law',
        provider: 'WIPO',
        link: 'https://example.com/ip-law',
        description: 'IP law and practice',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'National Law School of India University',
        location: 'Bangalore',
        programs: ['BA LLB', 'LLM'],
        link: 'https://example.com/nls',
        description: 'Premier law school'
      },
      {
        name: 'National Law University',
        location: 'Delhi',
        programs: ['BA LLB', 'LLM'],
        link: 'https://example.com/nlu-delhi',
        description: 'Leading law university'
      },
      {
        name: 'Symbiosis Law School',
        location: 'Pune',
        programs: ['BA LLB', 'LLM'],
        link: 'https://example.com/symbiosis',
        description: 'Top private law school'
      }
    ],
    articles: [
      {
        title: 'Legal Tech Revolution',
        author: 'Legal Tech Review',
        link: 'https://example.com/legal-tech',
        description: 'Technology in legal practice',
        publishedDate: new Date('2023-07-15')
      },
      {
        title: 'Future of Legal Practice',
        author: 'Law Journal',
        link: 'https://example.com/law-future',
        description: 'Emerging trends in legal practice',
        publishedDate: new Date('2023-08-15')
      },
      {
        title: 'Alternative Dispute Resolution',
        author: 'ADR Review',
        link: 'https://example.com/adr',
        description: 'Modern dispute resolution methods',
        publishedDate: new Date('2023-09-15')
      }
    ]
  },
  {
    title: 'Digital Marketing Specialist',
    description: 'Digital marketing specialists create and implement online marketing strategies to promote products and services.',
    skills: ['SEO', 'Social Media Marketing', 'Content Marketing', 'Analytics', 'PPC Advertising'],
    education: 'Bachelor\'s degree in Marketing or related field',
    averageSalary: '₹4,00,000 - ₹15,00,000 per year',
    jobOutlook: 'Growing much faster than average (25% growth from 2020-2030)',
    careerTraits: {
      analytical: 8,
      creative: 9,
      communication: 9,
      technical: 7,
      strategic: 8,
      adaptability: 9
    },
    books: [
      {
        title: 'Digital Marketing Strategy',
        author: 'Simon Kingsnorth',
        link: 'https://example.com/digital-strategy',
        description: 'Comprehensive guide to digital marketing.'
      },
      {
        title: 'SEO 2023',
        author: 'Adam Clarke',
        link: 'https://example.com/seo-guide',
        description: 'Latest SEO techniques and strategies.'
      },
      {
        title: 'Social Media Marketing',
        author: 'Gary Vaynerchuk',
        link: 'https://example.com/social-media',
        description: 'Guide to social media marketing.'
      }
    ],
    courses: [
      {
        title: 'Digital Marketing Professional',
        provider: 'Google',
        link: 'https://example.com/google-digital',
        description: 'Google certified digital marketing course',
        isOnline: true
      },
      {
        title: 'Social Media Marketing',
        provider: 'HubSpot',
        link: 'https://example.com/hubspot-social',
        description: 'Comprehensive social media marketing',
        isOnline: true
      },
      {
        title: 'SEO Masterclass',
        provider: 'Moz',
        link: 'https://example.com/moz-seo',
        description: 'Advanced SEO techniques',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'Indian Institute of Management (IIM)',
        location: 'Multiple Locations',
        programs: ['MBA in Marketing', 'Digital Marketing Certificate'],
        link: 'https://example.com/iim-digital',
        description: 'Premier management institution'
      },
      {
        name: 'MICA',
        location: 'Ahmedabad',
        programs: ['PGDM in Marketing', 'Digital Marketing Specialization'],
        link: 'https://example.com/mica',
        description: 'Leading marketing communications institute'
      },
      {
        name: 'Symbiosis Institute of Media and Communication',
        location: 'Pune',
        programs: ['MBA in Marketing', 'Digital Marketing'],
        link: 'https://example.com/simc',
        description: 'Top media and communication institute'
      }
    ],
    articles: [
      {
        title: 'Future of Digital Marketing',
        author: 'Marketing Today',
        link: 'https://example.com/digital-future',
        description: 'Emerging trends in digital marketing',
        publishedDate: new Date('2023-07-20')
      },
      {
        title: 'AI in Marketing',
        author: 'Tech Marketing',
        link: 'https://example.com/ai-marketing',
        description: 'Artificial intelligence in marketing',
        publishedDate: new Date('2023-08-20')
      },
      {
        title: 'Content Marketing Strategies',
        author: 'Content Marketing Institute',
        link: 'https://example.com/content-strategies',
        description: 'Modern content marketing approaches',
        publishedDate: new Date('2023-09-20')
      }
    ]
  },
  {
    title: 'Architect',
    description: 'Architects design buildings and structures, considering aesthetics, functionality, and safety.',
    skills: ['Architectural Design', 'AutoCAD', '3D Modeling', 'Project Management', 'Building Codes'],
    education: 'B.Arch from recognized architecture school',
    averageSalary: '₹6,00,000 - ₹20,00,000 per year',
    jobOutlook: 'Growing as fast as average (8% growth from 2020-2030)',
    careerTraits: {
      creative: 9,
      technical: 8,
      analytical: 8,
      communication: 8,
      attentionToDetail: 9,
      problemSolving: 8
    },
    books: [
      {
        title: 'Architecture: Form, Space, and Order',
        author: 'Francis D.K. Ching',
        link: 'https://example.com/architecture-form',
        description: 'Fundamental principles of architectural design.'
      },
      {
        title: 'Building Construction Illustrated',
        author: 'Francis D.K. Ching',
        link: 'https://example.com/building-construction',
        description: 'Comprehensive guide to building construction.'
      },
      {
        title: 'Architectural Graphics',
        author: 'Francis D.K. Ching',
        link: 'https://example.com/arch-graphics',
        description: 'Guide to architectural drawing and representation.'
      }
    ],
    courses: [
      {
        title: 'Architectural Design Studio',
        provider: 'CEPT University',
        link: 'https://example.com/design-studio',
        description: 'Advanced architectural design concepts',
        isOnline: false
      },
      {
        title: 'Sustainable Architecture',
        provider: 'IIT Roorkee',
        link: 'https://example.com/sustainable-arch',
        description: 'Green building design principles',
        isOnline: true
      },
      {
        title: 'Digital Architecture',
        provider: 'NPTEL',
        link: 'https://example.com/digital-arch',
        description: 'Modern architectural technology',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'School of Planning and Architecture',
        location: 'New Delhi',
        programs: ['B.Arch', 'M.Arch'],
        link: 'https://example.com/spa',
        description: 'Premier architecture institution'
      },
      {
        name: 'CEPT University',
        location: 'Ahmedabad',
        programs: ['B.Arch', 'M.Arch'],
        link: 'https://example.com/cept',
        description: 'Leading architecture and planning university'
      },
      {
        name: 'IIT Kharagpur',
        location: 'Kharagpur',
        programs: ['B.Arch', 'M.Arch'],
        link: 'https://example.com/iit-kgp',
        description: 'Top technical institute for architecture'
      }
    ],
    articles: [
      {
        title: 'Sustainable Architecture Trends',
        author: 'Architecture Today',
        link: 'https://example.com/sustainable-trends',
        description: 'Green building design trends',
        publishedDate: new Date('2023-07-25')
      },
      {
        title: 'Digital Architecture',
        author: 'Arch Tech Review',
        link: 'https://example.com/digital-arch-trends',
        description: 'Technology in modern architecture',
        publishedDate: new Date('2023-08-25')
      },
      {
        title: 'Future of Urban Design',
        author: 'Urban Planning Journal',
        link: 'https://example.com/urban-future',
        description: 'Emerging trends in urban architecture',
        publishedDate: new Date('2023-09-25')
      }
    ]
  },
  {
    title: 'Psychologist',
    description: 'Psychologists study human behavior and mental processes, providing counseling and therapy.',
    skills: ['Counseling', 'Research', 'Assessment', 'Communication', 'Problem Solving'],
    education: 'MA/MSc in Psychology followed by M.Phil/Ph.D',
    averageSalary: '₹5,00,000 - ₹18,00,000 per year',
    jobOutlook: 'Growing faster than average (14% growth from 2020-2030)',
    careerTraits: {
      empathy: 9,
      communication: 9,
      analytical: 8,
      patience: 9,
      research: 8,
      problemSolving: 8
    },
    books: [
      {
        title: 'Introduction to Psychology',
        author: 'Hilgard and Atkinson',
        link: 'https://example.com/intro-psych',
        description: 'Comprehensive introduction to psychology.'
      },
      {
        title: 'Abnormal Psychology',
        author: 'Ronald J. Comer',
        link: 'https://example.com/abnormal-psych',
        description: 'Study of psychological disorders.'
      },
      {
        title: 'Cognitive Psychology',
        author: 'Robert L. Solso',
        link: 'https://example.com/cognitive-psych',
        description: 'Understanding mental processes.'
      }
    ],
    courses: [
      {
        title: 'Clinical Psychology',
        provider: 'NIMHANS',
        link: 'https://example.com/clinical-psych',
        description: 'Advanced clinical psychology training',
        isOnline: false
      },
      {
        title: 'Counseling Psychology',
        provider: 'Tata Institute of Social Sciences',
        link: 'https://example.com/counseling-psych',
        description: 'Professional counseling skills',
        isOnline: false
      },
      {
        title: 'Industrial Psychology',
        provider: 'XLRI',
        link: 'https://example.com/industrial-psych',
        description: 'Psychology in workplace settings',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'National Institute of Mental Health and Neurosciences',
        location: 'Bangalore',
        programs: ['M.Phil in Clinical Psychology', 'Ph.D in Psychology'],
        link: 'https://example.com/nimhans',
        description: 'Premier mental health institution'
      },
      {
        name: 'Tata Institute of Social Sciences',
        location: 'Mumbai',
        programs: ['MA in Psychology', 'M.Phil in Clinical Psychology'],
        link: 'https://example.com/tiss',
        description: 'Leading social sciences institution'
      },
      {
        name: 'University of Delhi',
        location: 'Delhi',
        programs: ['MA in Psychology', 'Ph.D in Psychology'],
        link: 'https://example.com/du-psych',
        description: 'Top psychology department'
      }
    ],
    articles: [
      {
        title: 'Mental Health in Modern Society',
        author: 'Psychology Today',
        link: 'https://example.com/mental-health',
        description: 'Contemporary mental health challenges',
        publishedDate: new Date('2023-07-30')
      },
      {
        title: 'Digital Mental Health',
        author: 'Tech Psychology',
        link: 'https://example.com/digital-mental-health',
        description: 'Technology in mental health care',
        publishedDate: new Date('2023-08-30')
      },
      {
        title: 'Future of Psychology',
        author: 'Psychology Review',
        link: 'https://example.com/psych-future',
        description: 'Emerging trends in psychology',
        publishedDate: new Date('2023-09-30')
      }
    ]
  },
  {
    title: 'Investment Banker',
    description: 'Investment bankers help companies raise capital and provide financial advisory services.',
    skills: ['Financial Analysis', 'Valuation', 'Deal Structuring', 'Market Research', 'Client Management'],
    education: 'MBA in Finance or related field',
    averageSalary: '₹12,00,000 - ₹40,00,000 per year',
    jobOutlook: 'Growing as fast as average (10% growth from 2020-2030)',
    careerTraits: {
      analytical: 9,
      strategic: 9,
      communication: 9,
      pressureHandling: 9,
      negotiation: 9,
      attentionToDetail: 9
    },
    books: [
      {
        title: 'Investment Banking',
        author: 'Joshua Rosenbaum',
        link: 'https://example.com/investment-banking',
        description: 'Comprehensive guide to investment banking.'
      },
      {
        title: 'Valuation',
        author: 'McKinsey & Company',
        link: 'https://example.com/valuation',
        description: 'Techniques for company valuation.'
      },
      {
        title: 'Financial Modeling',
        author: 'Simon Benninga',
        link: 'https://example.com/financial-modeling',
        description: 'Advanced financial modeling techniques.'
      }
    ],
    courses: [
      {
        title: 'Investment Banking Professional',
        provider: 'CFA Institute',
        link: 'https://example.com/cfa',
        description: 'Professional certification in finance',
        isOnline: true
      },
      {
        title: 'Financial Modeling',
        provider: 'Wall Street Prep',
        link: 'https://example.com/wall-street-prep',
        description: 'Advanced financial modeling',
        isOnline: true
      },
      {
        title: 'Mergers and Acquisitions',
        provider: 'NYIF',
        link: 'https://example.com/ma-course',
        description: 'M&A strategies and execution',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'Indian Institute of Management (IIM)',
        location: 'Multiple Locations',
        programs: ['MBA in Finance', 'PGP in Finance'],
        link: 'https://example.com/iim-finance',
        description: 'Premier management institution'
      },
      {
        name: 'XLRI Jamshedpur',
        location: 'Jamshedpur',
        programs: ['PGDM in Finance', 'Executive MBA'],
        link: 'https://example.com/xlri',
        description: 'Leading business school'
      },
      {
        name: 'ISB Hyderabad',
        location: 'Hyderabad',
        programs: ['PGP in Finance', 'Executive MBA'],
        link: 'https://example.com/isb',
        description: 'Top business school'
      }
    ],
    articles: [
      {
        title: 'Future of Investment Banking',
        author: 'Finance Today',
        link: 'https://example.com/ib-future',
        description: 'Emerging trends in investment banking',
        publishedDate: new Date('2023-08-01')
      },
      {
        title: 'Digital Transformation in Finance',
        author: 'Financial Tech',
        link: 'https://example.com/fin-tech',
        description: 'Technology in financial services',
        publishedDate: new Date('2023-09-01')
      },
      {
        title: 'Sustainable Finance',
        author: 'ESG Review',
        link: 'https://example.com/sustainable-finance',
        description: 'Environmental, social, and governance in finance',
        publishedDate: new Date('2023-10-01')
      }
    ]
  },
  {
    title: 'Pharmacist',
    description: 'Pharmacists dispense medications and provide pharmaceutical care to patients.',
    skills: ['Medication Management', 'Patient Counseling', 'Pharmaceutical Knowledge', 'Inventory Management', 'Healthcare Regulations'],
    education: 'B.Pharm followed by Pharm.D or M.Pharm',
    averageSalary: '₹4,00,000 - ₹12,00,000 per year',
    jobOutlook: 'Growing as fast as average (9% growth from 2020-2030)',
    careerTraits: {
      analytical: 8,
      attentionToDetail: 9,
      communication: 8,
      ethical: 9,
      organization: 8,
      problemSolving: 8
    },
    books: [
      {
        title: 'Pharmaceutical Analysis',
        author: 'David G. Watson',
        link: 'https://example.com/pharma-analysis',
        description: 'Comprehensive guide to pharmaceutical analysis.'
      },
      {
        title: 'Clinical Pharmacy',
        author: 'Roger Walker',
        link: 'https://example.com/clinical-pharmacy',
        description: 'Clinical aspects of pharmacy practice.'
      },
      {
        title: 'Pharmacy Law and Ethics',
        author: 'Dale A. Conner',
        link: 'https://example.com/pharmacy-law',
        description: 'Legal and ethical aspects of pharmacy.'
      }
    ],
    courses: [
      {
        title: 'Clinical Pharmacy Practice',
        provider: 'NIPER',
        link: 'https://example.com/clinical-practice',
        description: 'Advanced clinical pharmacy training',
        isOnline: false
      },
      {
        title: 'Pharmaceutical Management',
        provider: 'JSS College of Pharmacy',
        link: 'https://example.com/pharma-mgmt',
        description: 'Pharmacy business management',
        isOnline: true
      },
      {
        title: 'Drug Regulatory Affairs',
        provider: 'NIPER',
        link: 'https://example.com/regulatory-affairs',
        description: 'Pharmaceutical regulations and compliance',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'National Institute of Pharmaceutical Education and Research',
        location: 'Multiple Locations',
        programs: ['B.Pharm', 'M.Pharm', 'Pharm.D'],
        link: 'https://example.com/niper',
        description: 'Premier pharmaceutical institution'
      },
      {
        name: 'Manipal College of Pharmaceutical Sciences',
        location: 'Manipal',
        programs: ['B.Pharm', 'M.Pharm', 'Pharm.D'],
        link: 'https://example.com/manipal-pharma',
        description: 'Leading pharmacy college'
      },
      {
        name: 'JSS College of Pharmacy',
        location: 'Mysore',
        programs: ['B.Pharm', 'M.Pharm', 'Pharm.D'],
        link: 'https://example.com/jss-pharma',
        description: 'Top pharmacy institution'
      }
    ],
    articles: [
      {
        title: 'Future of Pharmacy Practice',
        author: 'Pharmacy Today',
        link: 'https://example.com/pharmacy-future',
        description: 'Emerging trends in pharmacy',
        publishedDate: new Date('2023-08-05')
      },
      {
        title: 'Digital Pharmacy',
        author: 'Pharma Tech',
        link: 'https://example.com/digital-pharmacy',
        description: 'Technology in pharmacy practice',
        publishedDate: new Date('2023-09-05')
      },
      {
        title: 'Pharmaceutical Research',
        author: 'Research Review',
        link: 'https://example.com/pharma-research',
        description: 'Latest developments in pharmaceutical research',
        publishedDate: new Date('2023-10-05')
      }
    ]
  },
  {
    title: 'UI/UX Designer',
    description: 'UI/UX designers create user interfaces and experiences for digital products.',
    skills: ['User Research', 'Wireframing', 'Prototyping', 'Visual Design', 'User Testing'],
    education: 'Bachelor\'s degree in Design or related field',
    averageSalary: '₹6,00,000 - ₹20,00,000 per year',
    jobOutlook: 'Growing much faster than average (23% growth from 2020-2030)',
    careerTraits: {
      creative: 9,
      analytical: 8,
      communication: 8,
      empathy: 9,
      technical: 7,
      problemSolving: 8
    },
    books: [
      {
        title: 'Don\'t Make Me Think',
        author: 'Steve Krug',
        link: 'https://example.com/dont-make-me-think',
        description: 'Classic guide to web usability.'
      },
      {
        title: 'The Design of Everyday Things',
        author: 'Don Norman',
        link: 'https://example.com/design-everyday',
        description: 'Fundamental principles of design.'
      },
      {
        title: 'About Face',
        author: 'Alan Cooper',
        link: 'https://example.com/about-face',
        description: 'The essentials of interaction design.'
      }
    ],
    courses: [
      {
        title: 'UI/UX Design Professional',
        provider: 'Google',
        link: 'https://example.com/google-ux',
        description: 'Professional UX design certification',
        isOnline: true
      },
      {
        title: 'Interaction Design',
        provider: 'Interaction Design Foundation',
        link: 'https://example.com/interaction-design',
        description: 'Comprehensive interaction design course',
        isOnline: true
      },
      {
        title: 'User Research Methods',
        provider: 'Nielsen Norman Group',
        link: 'https://example.com/user-research',
        description: 'Advanced user research techniques',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'National Institute of Design',
        location: 'Multiple Locations',
        programs: ['B.Des in Interaction Design', 'M.Des in Digital Design'],
        link: 'https://example.com/nid',
        description: 'Premier design institution'
      },
      {
        name: 'MIT Institute of Design',
        location: 'Pune',
        programs: ['B.Des in Interaction Design', 'M.Des in User Experience Design'],
        link: 'https://example.com/mit-id',
        description: 'Leading design school'
      },
      {
        name: 'Srishti Institute of Art, Design and Technology',
        location: 'Bangalore',
        programs: ['B.Des in Interaction Design', 'M.Des in Digital Design'],
        link: 'https://example.com/srishti',
        description: 'Top design institute'
      }
    ],
    articles: [
      {
        title: 'Future of UI/UX Design',
        author: 'Design Today',
        link: 'https://example.com/ux-future',
        description: 'Emerging trends in UI/UX design',
        publishedDate: new Date('2023-08-10')
      },
      {
        title: 'AI in Design',
        author: 'Design Tech',
        link: 'https://example.com/ai-design',
        description: 'Artificial intelligence in design',
        publishedDate: new Date('2023-09-10')
      },
      {
        title: 'Accessibility in Design',
        author: 'Inclusive Design',
        link: 'https://example.com/accessibility',
        description: 'Designing for accessibility',
        publishedDate: new Date('2023-10-10')
      }
    ]
  },
  {
    title: 'Environmental Scientist',
    description: 'Environmental scientists study and solve environmental problems.',
    skills: ['Environmental Analysis', 'Research', 'Data Collection', 'Policy Analysis', 'Environmental Assessment'],
    education: 'B.Sc/M.Sc in Environmental Science or related field',
    averageSalary: '₹5,00,000 - ₹15,00,000 per year',
    jobOutlook: 'Growing faster than average (11% growth from 2020-2030)',
    careerTraits: {
      analytical: 9,
      research: 9,
      problemSolving: 9,
      communication: 8,
      technical: 8,
      environmentalAwareness: 9
    },
    books: [
      {
        title: 'Environmental Science',
        author: 'G. Tyler Miller',
        link: 'https://example.com/env-science',
        description: 'Comprehensive guide to environmental science.'
      },
      {
        title: 'Silent Spring',
        author: 'Rachel Carson',
        link: 'https://example.com/silent-spring',
        description: 'Classic environmental literature.'
      },
      {
        title: 'Environmental Policy',
        author: 'Norman J. Vig',
        link: 'https://example.com/env-policy',
        description: 'Guide to environmental policy and regulation.'
      }
    ],
    courses: [
      {
        title: 'Environmental Management',
        provider: 'TERI University',
        link: 'https://example.com/env-mgmt',
        description: 'Advanced environmental management',
        isOnline: false
      },
      {
        title: 'Climate Change Science',
        provider: 'IISc Bangalore',
        link: 'https://example.com/climate-science',
        description: 'Climate change research and analysis',
        isOnline: true
      },
      {
        title: 'Environmental Impact Assessment',
        provider: 'NPTEL',
        link: 'https://example.com/eia',
        description: 'Environmental assessment techniques',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'TERI University',
        location: 'New Delhi',
        programs: ['M.Sc in Environmental Studies', 'Ph.D in Environmental Science'],
        link: 'https://example.com/teri',
        description: 'Premier environmental institution'
      },
      {
        name: 'Indian Institute of Science',
        location: 'Bangalore',
        programs: ['M.Sc in Environmental Science', 'Ph.D in Environmental Science'],
        link: 'https://example.com/iisc',
        description: 'Leading research institution'
      },
      {
        name: 'Jawaharlal Nehru University',
        location: 'New Delhi',
        programs: ['M.Sc in Environmental Sciences', 'Ph.D in Environmental Studies'],
        link: 'https://example.com/jnu',
        description: 'Top environmental science department'
      }
    ],
    articles: [
      {
        title: 'Climate Change Research',
        author: 'Environmental Review',
        link: 'https://example.com/climate-research',
        description: 'Latest climate change research',
        publishedDate: new Date('2023-08-15')
      },
      {
        title: 'Sustainable Development',
        author: 'Sustainability Today',
        link: 'https://example.com/sustainable-dev',
        description: 'Sustainable development practices',
        publishedDate: new Date('2023-09-15')
      },
      {
        title: 'Environmental Policy',
        author: 'Policy Review',
        link: 'https://example.com/env-policy-review',
        description: 'Environmental policy developments',
        publishedDate: new Date('2023-10-15')
      }
    ]
  },
  {
    title: 'Education Consultant',
    description: 'Education consultants provide guidance on educational planning, curriculum development, and student success.',
    skills: ['Educational Planning', 'Curriculum Development', 'Student Counseling', 'Educational Policy', 'Assessment'],
    education: 'Master\'s degree in Education or related field',
    averageSalary: '₹5,00,000 - ₹15,00,000 per year',
    jobOutlook: 'Growing faster than average (13% growth from 2020-2030)',
    careerTraits: {
      communication: 9,
      analytical: 8,
      empathy: 9,
      organization: 8,
      problemSolving: 8,
      leadership: 8
    },
    books: [
      {
        title: 'Educational Leadership',
        author: 'Peter G. Northouse',
        link: 'https://example.com/edu-leadership',
        description: 'Principles of educational leadership.'
      },
      {
        title: 'Curriculum Development',
        author: 'Allan C. Ornstein',
        link: 'https://example.com/curriculum-dev',
        description: 'Guide to curriculum planning and development.'
      },
      {
        title: 'Educational Psychology',
        author: 'Anita Woolfolk',
        link: 'https://example.com/edu-psychology',
        description: 'Psychological principles in education.'
      }
    ],
    courses: [
      {
        title: 'Educational Leadership',
        provider: 'Harvard Education',
        link: 'https://example.com/harvard-edu',
        description: 'Advanced educational leadership',
        isOnline: true
      },
      {
        title: 'Curriculum Design',
        provider: 'Teachers College, Columbia',
        link: 'https://example.com/curriculum-design',
        description: 'Modern curriculum development',
        isOnline: true
      },
      {
        title: 'Educational Assessment',
        provider: 'Stanford Online',
        link: 'https://example.com/edu-assessment',
        description: 'Educational evaluation methods',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'Tata Institute of Social Sciences',
        location: 'Mumbai',
        programs: ['M.Ed', 'Ph.D in Education'],
        link: 'https://example.com/tiss-edu',
        description: 'Premier education institution'
      },
      {
        name: 'National University of Educational Planning and Administration',
        location: 'New Delhi',
        programs: ['M.Ed', 'Ph.D in Education'],
        link: 'https://example.com/nuepa',
        description: 'Leading education planning institution'
      },
      {
        name: 'Azim Premji University',
        location: 'Bangalore',
        programs: ['MA in Education', 'Ph.D in Education'],
        link: 'https://example.com/azim-premji',
        description: 'Top education university'
      }
    ],
    articles: [
      {
        title: 'Future of Education',
        author: 'Education Today',
        link: 'https://example.com/edu-future',
        description: 'Emerging trends in education',
        publishedDate: new Date('2023-08-20')
      },
      {
        title: 'Digital Learning',
        author: 'EdTech Review',
        link: 'https://example.com/digital-learning',
        description: 'Technology in education',
        publishedDate: new Date('2023-09-20')
      },
      {
        title: 'Educational Policy',
        author: 'Policy Review',
        link: 'https://example.com/edu-policy',
        description: 'Education policy developments',
        publishedDate: new Date('2023-10-20')
      }
    ]
  },
  {
    title: 'Content Creator',
    description: 'Content creators produce engaging digital content across various platforms.',
    skills: ['Content Writing', 'Video Production', 'Social Media', 'Digital Marketing', 'Storytelling'],
    education: 'Bachelor\'s degree in Media, Communications, or related field',
    averageSalary: '₹4,00,000 - ₹15,00,000 per year',
    jobOutlook: 'Growing much faster than average (24% growth from 2020-2030)',
    careerTraits: {
      creative: 9,
      communication: 9,
      technical: 7,
      adaptability: 9,
      research: 8,
      socialMedia: 9
    },
    books: [
      {
        title: 'Content Strategy',
        author: 'Kristina Halvorson',
        link: 'https://example.com/content-strategy',
        description: 'Guide to content strategy and creation.'
      },
      {
        title: 'Storytelling for Social Media',
        author: 'Gary Vaynerchuk',
        link: 'https://example.com/social-storytelling',
        description: 'Creating engaging social media content.'
      },
      {
        title: 'Digital Content Creation',
        author: 'Liza Enebeis',
        link: 'https://example.com/digital-content',
        description: 'Modern content creation techniques.'
      }
    ],
    courses: [
      {
        title: 'Content Creation Professional',
        provider: 'HubSpot',
        link: 'https://example.com/hubspot-content',
        description: 'Professional content creation',
        isOnline: true
      },
      {
        title: 'Video Production',
        provider: 'Udemy',
        link: 'https://example.com/video-production',
        description: 'Digital video production',
        isOnline: true
      },
      {
        title: 'Social Media Marketing',
        provider: 'Facebook Blueprint',
        link: 'https://example.com/facebook-blueprint',
        description: 'Social media content strategy',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'Symbiosis Institute of Media and Communication',
        location: 'Pune',
        programs: ['MA in Communication', 'PG Diploma in Digital Media'],
        link: 'https://example.com/simc',
        description: 'Premier media institution'
      },
      {
        name: 'MICA',
        location: 'Ahmedabad',
        programs: ['PGDM in Communication', 'Digital Marketing'],
        link: 'https://example.com/mica',
        description: 'Leading communication institute'
      },
      {
        name: 'Xavier Institute of Communications',
        location: 'Mumbai',
        programs: ['PG Diploma in Digital Media', 'Content Creation'],
        link: 'https://example.com/xic',
        description: 'Top media training institute'
      }
    ],
    articles: [
      {
        title: 'Future of Content Creation',
        author: 'Content Today',
        link: 'https://example.com/content-future',
        description: 'Emerging trends in content creation',
        publishedDate: new Date('2023-08-25')
      },
      {
        title: 'AI in Content Creation',
        author: 'Content Tech',
        link: 'https://example.com/ai-content',
        description: 'Artificial intelligence in content creation',
        publishedDate: new Date('2023-09-25')
      },
      {
        title: 'Content Monetization',
        author: 'Creator Economy',
        link: 'https://example.com/content-monetization',
        description: 'Strategies for content monetization',
        publishedDate: new Date('2023-10-25')
      }
    ]
  },
  {
    title: 'Business Analyst',
    description: 'Business analysts analyze business processes and recommend solutions to improve efficiency.',
    skills: ['Business Analysis', 'Data Analysis', 'Process Improvement', 'Requirements Gathering', 'Project Management'],
    education: 'Bachelor\'s degree in Business, IT, or related field',
    averageSalary: '₹6,00,000 - ₹20,00,000 per year',
    jobOutlook: 'Growing much faster than average (19% growth from 2020-2030)',
    careerTraits: {
      analytical: 9,
      communication: 8,
      problemSolving: 9,
      technical: 8,
      organization: 8,
      businessAcumen: 9
    },
    books: [
      {
        title: 'Business Analysis Body of Knowledge',
        author: 'IIBA',
        link: 'https://example.com/babok',
        description: 'Comprehensive guide to business analysis.'
      },
      {
        title: 'Requirements Engineering',
        author: 'Elizabeth Hull',
        link: 'https://example.com/requirements',
        description: 'Guide to requirements gathering and analysis.'
      },
      {
        title: 'Business Process Management',
        author: 'John Jeston',
        link: 'https://example.com/bpm',
        description: 'Process improvement and management.'
      }
    ],
    courses: [
      {
        title: 'Business Analysis Professional',
        provider: 'IIBA',
        link: 'https://example.com/iiba-cert',
        description: 'Professional business analysis certification',
        isOnline: true
      },
      {
        title: 'Data Analysis for Business',
        provider: 'Coursera',
        link: 'https://example.com/data-analysis',
        description: 'Business data analysis techniques',
        isOnline: true
      },
      {
        title: 'Agile Business Analysis',
        provider: 'ICAgile',
        link: 'https://example.com/agile-ba',
        description: 'Business analysis in agile environments',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'Indian Institute of Management (IIM)',
        location: 'Multiple Locations',
        programs: ['MBA in Business Analytics', 'PGP in Business Analysis'],
        link: 'https://example.com/iim-ba',
        description: 'Premier management institution'
      },
      {
        name: 'XLRI Jamshedpur',
        location: 'Jamshedpur',
        programs: ['PGDM in Business Analytics', 'Executive MBA'],
        link: 'https://example.com/xlri-ba',
        description: 'Leading business school'
      },
      {
        name: 'ISB Hyderabad',
        location: 'Hyderabad',
        programs: ['PGP in Business Analytics', 'Executive MBA'],
        link: 'https://example.com/isb-ba',
        description: 'Top business school'
      }
    ],
    articles: [
      {
        title: 'Future of Business Analysis',
        author: 'Business Analysis Today',
        link: 'https://example.com/ba-future',
        description: 'Emerging trends in business analysis',
        publishedDate: new Date('2023-08-30')
      },
      {
        title: 'Data-Driven Business Analysis',
        author: 'Data Analytics Review',
        link: 'https://example.com/data-driven-ba',
        description: 'Data analytics in business analysis',
        publishedDate: new Date('2023-09-30')
      },
      {
        title: 'Agile Business Analysis',
        author: 'Agile Review',
        link: 'https://example.com/agile-ba-review',
        description: 'Business analysis in agile environments',
        publishedDate: new Date('2023-10-30')
      }
    ]
  },
  {
    title: 'Physiotherapist',
    description: 'Physiotherapists help patients recover from injuries and improve physical mobility.',
    skills: ['Physical Therapy', 'Patient Assessment', 'Rehabilitation', 'Exercise Prescription', 'Manual Therapy'],
    education: 'BPT (Bachelor of Physiotherapy) followed by MPT',
    averageSalary: '₹4,00,000 - ₹12,00,000 per year',
    jobOutlook: 'Growing faster than average (15% growth from 2020-2030)',
    careerTraits: {
      empathy: 9,
      communication: 9,
      technical: 8,
      problemSolving: 8,
      physical: 8,
      patience: 9
    },
    books: [
      {
        title: 'Physical Rehabilitation',
        author: 'Susan B. O\'Sullivan',
        link: 'https://example.com/physical-rehab',
        description: 'Comprehensive guide to physical rehabilitation.'
      },
      {
        title: 'Therapeutic Exercise',
        author: 'Carolyn Kisner',
        link: 'https://example.com/therapeutic-exercise',
        description: 'Guide to therapeutic exercise techniques.'
      },
      {
        title: 'Manual Therapy',
        author: 'Stanley V. Paris',
        link: 'https://example.com/manual-therapy',
        description: 'Manual therapy techniques and applications.'
      }
    ],
    courses: [
      {
        title: 'Advanced Physiotherapy',
        provider: 'Christian Medical College',
        link: 'https://example.com/advanced-pt',
        description: 'Advanced physiotherapy techniques',
        isOnline: false
      },
      {
        title: 'Sports Physiotherapy',
        provider: 'Sports Medicine India',
        link: 'https://example.com/sports-pt',
        description: 'Specialized sports rehabilitation',
        isOnline: true
      },
      {
        title: 'Neurological Rehabilitation',
        provider: 'NIMHANS',
        link: 'https://example.com/neuro-rehab',
        description: 'Neurological physiotherapy techniques',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'Christian Medical College',
        location: 'Vellore',
        programs: ['BPT', 'MPT'],
        link: 'https://example.com/cmc-pt',
        description: 'Premier physiotherapy institution'
      },
      {
        name: 'Manipal College of Allied Health Sciences',
        location: 'Manipal',
        programs: ['BPT', 'MPT'],
        link: 'https://example.com/manipal-pt',
        description: 'Leading physiotherapy college'
      },
      {
        name: 'JSS College of Physiotherapy',
        location: 'Mysore',
        programs: ['BPT', 'MPT'],
        link: 'https://example.com/jss-pt',
        description: 'Top physiotherapy institution'
      }
    ],
    articles: [
      {
        title: 'Future of Physiotherapy',
        author: 'Physiotherapy Today',
        link: 'https://example.com/pt-future',
        description: 'Emerging trends in physiotherapy',
        publishedDate: new Date('2023-09-01')
      },
      {
        title: 'Technology in Rehabilitation',
        author: 'Rehab Tech',
        link: 'https://example.com/rehab-tech',
        description: 'Technology in physical rehabilitation',
        publishedDate: new Date('2023-10-01')
      },
      {
        title: 'Sports Rehabilitation',
        author: 'Sports Medicine Review',
        link: 'https://example.com/sports-rehab',
        description: 'Advanced sports rehabilitation techniques',
        publishedDate: new Date('2023-11-01')
      }
    ]
  },
  {
    title: 'Cybersecurity Analyst',
    description: 'Cybersecurity analysts protect computer systems and networks from security threats.',
    skills: ['Network Security', 'Threat Analysis', 'Security Tools', 'Incident Response', 'Risk Assessment'],
    education: 'Bachelor\'s degree in Computer Science, IT, or related field',
    averageSalary: '₹8,00,000 - ₹25,00,000 per year',
    jobOutlook: 'Growing much faster than average (33% growth from 2020-2030)',
    careerTraits: {
      analytical: 9,
      technical: 9,
      problemSolving: 9,
      attentionToDetail: 9,
      ethical: 9,
      continuousLearning: 9
    },
    books: [
      {
        title: 'The Web Application Hacker\'s Handbook',
        author: 'Dafydd Stuttard',
        link: 'https://example.com/web-hacking',
        description: 'Guide to web application security.'
      },
      {
        title: 'Practical Malware Analysis',
        author: 'Michael Sikorski',
        link: 'https://example.com/malware-analysis',
        description: 'Comprehensive malware analysis guide.'
      },
      {
        title: 'Network Security Essentials',
        author: 'William Stallings',
        link: 'https://example.com/network-security',
        description: 'Fundamentals of network security.'
      }
    ],
    courses: [
      {
        title: 'Certified Information Systems Security Professional',
        provider: 'ISC2',
        link: 'https://example.com/cissp',
        description: 'Advanced cybersecurity certification',
        isOnline: true
      },
      {
        title: 'Certified Ethical Hacker',
        provider: 'EC-Council',
        link: 'https://example.com/ceh',
        description: 'Ethical hacking and penetration testing',
        isOnline: true
      },
      {
        title: 'CompTIA Security+',
        provider: 'CompTIA',
        link: 'https://example.com/security-plus',
        description: 'Fundamental cybersecurity certification',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'Indian Institute of Technology (IIT)',
        location: 'Multiple Locations',
        programs: ['B.Tech in Computer Science', 'M.Tech in Cybersecurity'],
        link: 'https://example.com/iit-cyber',
        description: 'Premier technical institution'
      },
      {
        name: 'National Institute of Technology (NIT)',
        location: 'Multiple Locations',
        programs: ['B.Tech in Computer Science', 'M.Tech in Information Security'],
        link: 'https://example.com/nit-cyber',
        description: 'Leading technical institution'
      },
      {
        name: 'International Institute of Information Technology',
        location: 'Hyderabad',
        programs: ['B.Tech in Computer Science', 'M.Tech in Cybersecurity'],
        link: 'https://example.com/iiit-cyber',
        description: 'Top cybersecurity institution'
      }
    ],
    articles: [
      {
        title: 'Future of Cybersecurity',
        author: 'Security Today',
        link: 'https://example.com/cyber-future',
        description: 'Emerging trends in cybersecurity',
        publishedDate: new Date('2023-09-05')
      },
      {
        title: 'AI in Cybersecurity',
        author: 'Security Tech',
        link: 'https://example.com/ai-security',
        description: 'Artificial intelligence in security',
        publishedDate: new Date('2023-10-05')
      },
      {
        title: 'Cloud Security',
        author: 'Cloud Security Review',
        link: 'https://example.com/cloud-security',
        description: 'Security in cloud computing',
        publishedDate: new Date('2023-11-05')
      }
    ]
  },
  {
    title: 'Graphic Designer',
    description: 'Graphic designers create visual content to communicate messages effectively.',
    skills: ['Visual Design', 'Typography', 'Adobe Creative Suite', 'Branding', 'Layout Design'],
    education: 'Bachelor\'s degree in Graphic Design or related field',
    averageSalary: '₹4,00,000 - ₹15,00,000 per year',
    jobOutlook: 'Growing as fast as average (8% growth from 2020-2030)',
    careerTraits: {
      creative: 9,
      technical: 8,
      communication: 8,
      attentionToDetail: 9,
      timeManagement: 8,
      adaptability: 8
    },
    books: [
      {
        title: 'The Elements of Graphic Design',
        author: 'Alex W. White',
        link: 'https://example.com/elements-design',
        description: 'Fundamental principles of graphic design.'
      },
      {
        title: 'Thinking with Type',
        author: 'Ellen Lupton',
        link: 'https://example.com/thinking-type',
        description: 'Guide to typography in design.'
      },
      {
        title: 'Logo Design Love',
        author: 'David Airey',
        link: 'https://example.com/logo-design',
        description: 'Creating memorable brand identities.'
      }
    ],
    courses: [
      {
        title: 'Graphic Design Professional',
        provider: 'Adobe',
        link: 'https://example.com/adobe-design',
        description: 'Professional design certification',
        isOnline: true
      },
      {
        title: 'UI/UX Design',
        provider: 'Coursera',
        link: 'https://example.com/uiux-design',
        description: 'Digital design principles',
        isOnline: true
      },
      {
        title: 'Brand Identity Design',
        provider: 'Skillshare',
        link: 'https://example.com/brand-design',
        description: 'Creating brand identities',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'National Institute of Design',
        location: 'Multiple Locations',
        programs: ['B.Des in Graphic Design', 'M.Des in Visual Communication'],
        link: 'https://example.com/nid-design',
        description: 'Premier design institution'
      },
      {
        name: 'MIT Institute of Design',
        location: 'Pune',
        programs: ['B.Des in Graphic Design', 'M.Des in Visual Communication'],
        link: 'https://example.com/mit-design',
        description: 'Leading design school'
      },
      {
        name: 'Srishti Institute of Art, Design and Technology',
        location: 'Bangalore',
        programs: ['B.Des in Graphic Design', 'M.Des in Visual Communication'],
        link: 'https://example.com/srishti-design',
        description: 'Top design institute'
      }
    ],
    articles: [
      {
        title: 'Future of Graphic Design',
        author: 'Design Today',
        link: 'https://example.com/design-future',
        description: 'Emerging trends in graphic design',
        publishedDate: new Date('2023-09-10')
      },
      {
        title: 'Digital Design Tools',
        author: 'Design Tech',
        link: 'https://example.com/design-tools',
        description: 'Modern design software and tools',
        publishedDate: new Date('2023-10-10')
      },
      {
        title: 'Brand Design',
        author: 'Brand Review',
        link: 'https://example.com/brand-design-review',
        description: 'Contemporary brand design trends',
        publishedDate: new Date('2023-11-10')
      }
    ]
  },
  {
    title: 'Python Developer',
    description: 'Python developers create applications, websites, and software solutions using the Python programming language.',
    skills: ['Python', 'Django/Flask', 'REST APIs', 'Database Design', 'Testing', 'Git', 'Cloud Services'],
    education: 'B.Tech/BE in Computer Science or related field',
    averageSalary: '₹7,00,000 - ₹25,00,000 per year',
    jobOutlook: 'Growing much faster than average (27% growth from 2020-2030)',
    careerTraits: {
      analytical: 9,
      technical: 9,
      problemSolving: 9,
      continuousLearning: 9,
      attentionToDetail: 8,
      communication: 7
    },
    books: [
      {
        title: 'Python Crash Course',
        author: 'Eric Matthes',
        link: 'https://example.com/python-crash',
        description: 'A hands-on, project-based introduction to programming.'
      },
      {
        title: 'Fluent Python',
        author: 'Luciano Ramalho',
        link: 'https://example.com/fluent-python',
        description: 'Clear, concise, and effective programming.'
      },
      {
        title: 'Django for Professionals',
        author: 'William S. Vincent',
        link: 'https://example.com/django-pro',
        description: 'Production websites with Python and Django.'
      }
    ],
    courses: [
      {
        title: 'Python for Everybody',
        provider: 'University of Michigan',
        link: 'https://example.com/python-everybody',
        description: 'Comprehensive Python programming course',
        isOnline: true
      },
      {
        title: 'Django Full Stack Developer',
        provider: 'Udemy',
        link: 'https://example.com/django-fullstack',
        description: 'Complete web development with Django',
        isOnline: true
      },
      {
        title: 'Advanced Python Programming',
        provider: 'Real Python',
        link: 'https://example.com/advanced-python',
        description: 'Advanced Python concepts and best practices',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'Indian Institute of Technology (IIT)',
        location: 'Multiple Locations',
        programs: ['B.Tech in Computer Science', 'M.Tech in Software Engineering'],
        link: 'https://example.com/iit-python',
        description: 'Premier technical institution with strong Python curriculum'
      },
      {
        name: 'National Institute of Technology (NIT)',
        location: 'Multiple Locations',
        programs: ['B.Tech in Computer Science', 'M.Tech in Software Systems'],
        link: 'https://example.com/nit-python',
        description: 'Leading technical institution with Python specialization'
      },
      {
        name: 'International Institute of Information Technology',
        location: 'Hyderabad',
        programs: ['B.Tech in Computer Science', 'M.Tech in Software Engineering'],
        link: 'https://example.com/iiit-python',
        description: 'Specialized in software development with Python'
      }
    ],
    articles: [
      {
        title: 'Python in 2024',
        author: 'Python Weekly',
        link: 'https://example.com/python-2024',
        description: 'Latest trends and developments in Python',
        publishedDate: new Date('2024-01-01')
      },
      {
        title: 'Python Web Development',
        author: 'Web Dev Review',
        link: 'https://example.com/python-web',
        description: 'Modern web development with Python frameworks',
        publishedDate: new Date('2024-01-15')
      },
      {
        title: 'Python for Data Science',
        author: 'Data Science Today',
        link: 'https://example.com/python-data',
        description: 'Python applications in data science and AI',
        publishedDate: new Date('2024-02-01')
      }
    ]
  },
  {
    title: 'Data Engineer (Python)',
    description: 'Data engineers build and maintain data pipelines and infrastructure using Python and related technologies.',
    skills: ['Python', 'Apache Spark', 'SQL', 'ETL', 'Data Warehousing', 'Big Data', 'Airflow'],
    education: 'B.Tech/BE in Computer Science or related field',
    averageSalary: '₹8,00,000 - ₹30,00,000 per year',
    jobOutlook: 'Growing much faster than average (29% growth from 2020-2030)',
    careerTraits: {
      analytical: 9,
      technical: 9,
      problemSolving: 9,
      systemDesign: 9,
      attentionToDetail: 9,
      continuousLearning: 9
    },
    books: [
      {
        title: 'Data Engineering with Python',
        author: 'Paul Crickard',
        link: 'https://example.com/data-eng-python',
        description: 'Building data pipelines with Python.'
      },
      {
        title: 'Designing Data-Intensive Applications',
        author: 'Martin Kleppmann',
        link: 'https://example.com/data-intensive',
        description: 'The big ideas behind reliable, scalable, and maintainable systems.'
      },
      {
        title: 'Python for Data Analysis',
        author: 'Wes McKinney',
        link: 'https://example.com/python-data-analysis',
        description: 'Data manipulation with pandas, NumPy, and IPython.'
      }
    ],
    courses: [
      {
        title: 'Data Engineering with Python',
        provider: 'DataCamp',
        link: 'https://example.com/datacamp-de',
        description: 'Comprehensive data engineering course',
        isOnline: true
      },
      {
        title: 'Apache Spark with Python',
        provider: 'Databricks',
        link: 'https://example.com/spark-python',
        description: 'Big data processing with PySpark',
        isOnline: true
      },
      {
        title: 'Data Pipeline Engineering',
        provider: 'Udacity',
        link: 'https://example.com/data-pipeline',
        description: 'Building data pipelines with Python',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'Indian Institute of Technology (IIT)',
        location: 'Multiple Locations',
        programs: ['B.Tech in Computer Science', 'M.Tech in Data Science'],
        link: 'https://example.com/iit-data',
        description: 'Premier technical institution with data engineering focus'
      },
      {
        name: 'Indian Statistical Institute',
        location: 'Multiple Locations',
        programs: ['M.Tech in Computer Science', 'M.Stat in Data Science'],
        link: 'https://example.com/isi-data',
        description: 'Leading statistics and data engineering institution'
      },
      {
        name: 'International Institute of Information Technology',
        location: 'Hyderabad',
        programs: ['M.Tech in Data Science', 'MS in Data Engineering'],
        link: 'https://example.com/iiit-data',
        description: 'Specialized in data engineering and analytics'
      }
    ],
    articles: [
      {
        title: 'Modern Data Engineering',
        author: 'Data Engineering Weekly',
        link: 'https://example.com/modern-de',
        description: 'Latest trends in data engineering',
        publishedDate: new Date('2024-01-05')
      },
      {
        title: 'Python in Data Engineering',
        author: 'Python Data',
        link: 'https://example.com/python-de',
        description: 'Python tools and frameworks for data engineering',
        publishedDate: new Date('2024-01-20')
      },
      {
        title: 'Big Data Processing',
        author: 'Big Data Review',
        link: 'https://example.com/big-data-proc',
        description: 'Advanced data processing techniques',
        publishedDate: new Date('2024-02-05')
      }
    ]
  },
  {
    title: 'Machine Learning Engineer (Python)',
    description: 'Machine Learning Engineers develop and deploy machine learning models using Python and related frameworks.',
    skills: ['Python', 'TensorFlow/PyTorch', 'Machine Learning', 'Deep Learning', 'Data Analysis', 'Model Deployment'],
    education: 'B.Tech/BE in Computer Science or related field with ML specialization',
    averageSalary: '₹10,00,000 - ₹35,00,000 per year',
    jobOutlook: 'Growing much faster than average (31% growth from 2020-2030)',
    careerTraits: {
      analytical: 9,
      technical: 9,
      mathematical: 9,
      research: 8,
      problemSolving: 9,
      continuousLearning: 9
    },
    books: [
      {
        title: 'Hands-On Machine Learning',
        author: 'Aurélien Géron',
        link: 'https://example.com/hands-on-ml',
        description: 'Practical machine learning with Python.'
      },
      {
        title: 'Deep Learning with Python',
        author: 'François Chollet',
        link: 'https://example.com/deep-learning-python',
        description: 'Building deep learning models with Keras.'
      },
      {
        title: 'Python Machine Learning',
        author: 'Sebastian Raschka',
        link: 'https://example.com/python-ml',
        description: 'Machine learning algorithms and applications.'
      }
    ],
    courses: [
      {
        title: 'Machine Learning Specialization',
        provider: 'Stanford Online',
        link: 'https://example.com/ml-stanford',
        description: 'Comprehensive machine learning course',
        isOnline: true
      },
      {
        title: 'Deep Learning Specialization',
        provider: 'deeplearning.ai',
        link: 'https://example.com/dl-specialization',
        description: 'Advanced deep learning concepts',
        isOnline: true
      },
      {
        title: 'Practical Machine Learning',
        provider: 'Fast.ai',
        link: 'https://example.com/fastai',
        description: 'Practical deep learning for coders',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'Indian Institute of Technology (IIT)',
        location: 'Multiple Locations',
        programs: ['B.Tech in Computer Science', 'M.Tech in AI/ML'],
        link: 'https://example.com/iit-ml',
        description: 'Premier technical institution with ML focus'
      },
      {
        name: 'Indian Statistical Institute',
        location: 'Multiple Locations',
        programs: ['M.Tech in Computer Science', 'M.Stat in AI/ML'],
        link: 'https://example.com/isi-ml',
        description: 'Leading statistics and ML institution'
      },
      {
        name: 'International Institute of Information Technology',
        location: 'Hyderabad',
        programs: ['M.Tech in AI/ML', 'MS in Machine Learning'],
        link: 'https://example.com/iiit-ml',
        description: 'Specialized in AI and machine learning'
      }
    ],
    articles: [
      {
        title: 'Future of Machine Learning',
        author: 'ML Review',
        link: 'https://example.com/ml-future',
        description: 'Emerging trends in machine learning',
        publishedDate: new Date('2024-01-10')
      },
      {
        title: 'Python in AI Development',
        author: 'AI Today',
        link: 'https://example.com/python-ai',
        description: 'Python frameworks for AI development',
        publishedDate: new Date('2024-01-25')
      },
      {
        title: 'Deep Learning Advances',
        author: 'Deep Learning Review',
        link: 'https://example.com/dl-advances',
        description: 'Latest developments in deep learning',
        publishedDate: new Date('2024-02-10')
      }
    ]
  },
  {
    title: 'DevOps Engineer (Python)',
    description: 'DevOps Engineers automate and streamline development and operations processes using Python and various tools.',
    skills: ['Python', 'Docker', 'Kubernetes', 'CI/CD', 'Cloud Platforms', 'Infrastructure as Code', 'Monitoring'],
    education: 'B.Tech/BE in Computer Science or related field',
    averageSalary: '₹9,00,000 - ₹30,00,000 per year',
    jobOutlook: 'Growing much faster than average (28% growth from 2020-2030)',
    careerTraits: {
      technical: 9,
      automation: 9,
      problemSolving: 9,
      systemDesign: 9,
      continuousLearning: 9,
      collaboration: 8
    },
    books: [
      {
        title: 'Python for DevOps',
        author: 'Noah Gift',
        link: 'https://example.com/python-devops',
        description: 'Learn Python for DevOps and automation.'
      },
      {
        title: 'Kubernetes Patterns',
        author: 'Bilgin Ibryam',
        link: 'https://example.com/k8s-patterns',
        description: 'Design patterns for containerized applications.'
      },
      {
        title: 'Infrastructure as Code',
        author: 'Kief Morris',
        link: 'https://example.com/iac',
        description: 'Managing infrastructure with code.'
      }
    ],
    courses: [
      {
        title: 'DevOps with Python',
        provider: 'Linux Academy',
        link: 'https://example.com/devops-python',
        description: 'Python automation for DevOps',
        isOnline: true
      },
      {
        title: 'Kubernetes Administration',
        provider: 'Cloud Native Computing Foundation',
        link: 'https://example.com/k8s-admin',
        description: 'Kubernetes administration and management',
        isOnline: true
      },
      {
        title: 'AWS DevOps Professional',
        provider: 'Amazon Web Services',
        link: 'https://example.com/aws-devops',
        description: 'DevOps practices on AWS',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'Indian Institute of Technology (IIT)',
        location: 'Multiple Locations',
        programs: ['B.Tech in Computer Science', 'M.Tech in Cloud Computing'],
        link: 'https://example.com/iit-devops',
        description: 'Premier technical institution with DevOps focus'
      },
      {
        name: 'National Institute of Technology (NIT)',
        location: 'Multiple Locations',
        programs: ['B.Tech in Computer Science', 'M.Tech in Software Systems'],
        link: 'https://example.com/nit-devops',
        description: 'Leading technical institution with cloud computing'
      },
      {
        name: 'International Institute of Information Technology',
        location: 'Hyderabad',
        programs: ['B.Tech in Computer Science', 'M.Tech in Cloud Computing'],
        link: 'https://example.com/iiit-devops',
        description: 'Specialized in cloud and DevOps'
      }
    ],
    articles: [
      {
        title: 'DevOps Best Practices',
        author: 'DevOps Review',
        link: 'https://example.com/devops-best',
        description: 'Modern DevOps practices and tools',
        publishedDate: new Date('2024-01-15')
      },
      {
        title: 'Cloud Native Development',
        author: 'Cloud Today',
        link: 'https://example.com/cloud-native',
        description: 'Cloud-native application development',
        publishedDate: new Date('2024-01-30')
      },
      {
        title: 'DevOps Automation',
        author: 'Automation Weekly',
        link: 'https://example.com/devops-auto',
        description: 'Automation in DevOps workflows',
        publishedDate: new Date('2024-02-15')
      }
    ]
  },
  {
    title: 'Full Stack Developer (Python)',
    description: 'Full Stack Developers build both frontend and backend applications using Python and related technologies.',
    skills: ['Python', 'Django/Flask', 'React/Vue', 'SQL/NoSQL', 'REST APIs', 'HTML/CSS', 'JavaScript'],
    education: 'B.Tech/BE in Computer Science or related field',
    averageSalary: '₹8,00,000 - ₹28,00,000 per year',
    jobOutlook: 'Growing much faster than average (26% growth from 2020-2030)',
    careerTraits: {
      technical: 9,
      problemSolving: 9,
      creativity: 8,
      attentionToDetail: 8,
      continuousLearning: 9,
      communication: 8
    },
    books: [
      {
        title: 'Full Stack Python',
        author: 'Matt Makai',
        link: 'https://example.com/fullstack-python',
        description: 'Complete guide to full stack development with Python.'
      },
      {
        title: 'Django for APIs',
        author: 'William S. Vincent',
        link: 'https://example.com/django-apis',
        description: 'Building web APIs with Django.'
      },
      {
        title: 'Modern Frontend Development',
        author: 'Alex Banks',
        link: 'https://example.com/modern-frontend',
        description: 'Modern frontend development techniques.'
      }
    ],
    courses: [
      {
        title: 'Full Stack Web Development',
        provider: 'Udemy',
        link: 'https://example.com/fullstack-web',
        description: 'Complete full stack development course',
        isOnline: true
      },
      {
        title: 'Django and React',
        provider: 'Coursera',
        link: 'https://example.com/django-react',
        description: 'Building full stack applications',
        isOnline: true
      },
      {
        title: 'Advanced Web Development',
        provider: 'Pluralsight',
        link: 'https://example.com/advanced-web',
        description: 'Advanced web development techniques',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'Indian Institute of Technology (IIT)',
        location: 'Multiple Locations',
        programs: ['B.Tech in Computer Science', 'M.Tech in Software Engineering'],
        link: 'https://example.com/iit-fullstack',
        description: 'Premier technical institution with web development focus'
      },
      {
        name: 'National Institute of Technology (NIT)',
        location: 'Multiple Locations',
        programs: ['B.Tech in Computer Science', 'M.Tech in Software Systems'],
        link: 'https://example.com/nit-fullstack',
        description: 'Leading technical institution with web technologies'
      },
      {
        name: 'International Institute of Information Technology',
        location: 'Hyderabad',
        programs: ['B.Tech in Computer Science', 'M.Tech in Software Engineering'],
        link: 'https://example.com/iiit-fullstack',
        description: 'Specialized in web development'
      }
    ],
    articles: [
      {
        title: 'Modern Web Development',
        author: 'Web Dev Today',
        link: 'https://example.com/modern-web',
        description: 'Latest trends in web development',
        publishedDate: new Date('2024-01-20')
      },
      {
        title: 'Full Stack Architecture',
        author: 'Architecture Review',
        link: 'https://example.com/fullstack-arch',
        description: 'Designing full stack applications',
        publishedDate: new Date('2024-02-05')
      },
      {
        title: 'Web Performance',
        author: 'Performance Weekly',
        link: 'https://example.com/web-perf',
        description: 'Optimizing web application performance',
        publishedDate: new Date('2024-02-20')
      }
    ]
  },
  {
    title: 'AI Research Scientist (Python)',
    description: 'AI Research Scientists develop new algorithms and models for artificial intelligence applications.',
    skills: ['Python', 'Deep Learning', 'Research', 'Algorithm Design', 'Mathematics', 'Statistics', 'Scientific Computing'],
    education: 'Ph.D. in Computer Science, AI, or related field',
    averageSalary: '₹15,00,000 - ₹45,00,000 per year',
    jobOutlook: 'Growing much faster than average (32% growth from 2020-2030)',
    careerTraits: {
      analytical: 9,
      research: 9,
      mathematical: 9,
      innovation: 9,
      problemSolving: 9,
      continuousLearning: 9
    },
    books: [
      {
        title: 'Deep Learning',
        author: 'Ian Goodfellow',
        link: 'https://example.com/deep-learning-book',
        description: 'Comprehensive guide to deep learning.'
      },
      {
        title: 'Artificial Intelligence: A Modern Approach',
        author: 'Stuart Russell',
        link: 'https://example.com/ai-modern',
        description: 'Foundational AI concepts and algorithms.'
      },
      {
        title: 'Reinforcement Learning',
        author: 'Richard S. Sutton',
        link: 'https://example.com/rl-book',
        description: 'An introduction to reinforcement learning.'
      }
    ],
    courses: [
      {
        title: 'Advanced Deep Learning',
        provider: 'DeepMind',
        link: 'https://example.com/advanced-dl',
        description: 'Advanced deep learning research',
        isOnline: true
      },
      {
        title: 'AI Research Methods',
        provider: 'Stanford Online',
        link: 'https://example.com/ai-research',
        description: 'Research methodologies in AI',
        isOnline: true
      },
      {
        title: 'Mathematical Foundations of AI',
        provider: 'MIT OpenCourseWare',
        link: 'https://example.com/math-ai',
        description: 'Mathematical concepts in AI',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'Indian Institute of Technology (IIT)',
        location: 'Multiple Locations',
        programs: ['Ph.D. in AI/ML', 'M.Tech in AI Research'],
        link: 'https://example.com/iit-ai-research',
        description: 'Premier research institution in AI'
      },
      {
        name: 'Indian Statistical Institute',
        location: 'Multiple Locations',
        programs: ['Ph.D. in AI/ML', 'M.Stat in AI Research'],
        link: 'https://example.com/isi-ai-research',
        description: 'Leading research institution in AI'
      },
      {
        name: 'International Institute of Information Technology',
        location: 'Hyderabad',
        programs: ['Ph.D. in AI/ML', 'MS in AI Research'],
        link: 'https://example.com/iiit-ai-research',
        description: 'Specialized in AI research'
      }
    ],
    articles: [
      {
        title: 'AI Research Frontiers',
        author: 'AI Research Review',
        link: 'https://example.com/ai-frontiers',
        description: 'Cutting-edge AI research',
        publishedDate: new Date('2024-01-25')
      },
      {
        title: 'Deep Learning Research',
        author: 'Deep Learning Review',
        link: 'https://example.com/dl-research',
        description: 'Latest developments in deep learning',
        publishedDate: new Date('2024-02-10')
      },
      {
        title: 'AI Ethics and Research',
        author: 'AI Ethics Journal',
        link: 'https://example.com/ai-ethics',
        description: 'Ethical considerations in AI research',
        publishedDate: new Date('2024-02-25')
      }
    ]
  },
  {
    title: 'Indian Administrative Service (IAS)',
    description: 'IAS officers are the administrative backbone of the Indian government, handling policy implementation and public administration.',
    skills: ['Public Administration', 'Policy Analysis', 'Leadership', 'Decision Making', 'Communication', 'Problem Solving'],
    education: 'Bachelor\'s degree in any discipline',
    averageSalary: '₹56,100 - ₹2,50,000 per month (plus benefits)',
    jobOutlook: 'Stable (Regular recruitment through UPSC)',
    careerTraits: {
      leadership: 9,
      analytical: 9,
      communication: 9,
      decisionMaking: 9,
      integrity: 9,
      adaptability: 9
    },
    books: [
      {
        title: 'Indian Polity',
        author: 'M. Laxmikanth',
        link: 'https://example.com/indian-polity',
        description: 'Comprehensive guide to Indian political system.'
      },
      {
        title: 'Indian Economy',
        author: 'Ramesh Singh',
        link: 'https://example.com/indian-economy',
        description: 'Detailed analysis of Indian economy.'
      },
      {
        title: 'Public Administration',
        author: 'Fadia and Fadia',
        link: 'https://example.com/public-admin',
        description: 'Guide to public administration concepts.'
      }
    ],
    courses: [
      {
        title: 'UPSC Civil Services Preparation',
        provider: 'Vajiram and Ravi',
        link: 'https://example.com/vajiram',
        description: 'Comprehensive IAS preparation course',
        isOnline: false
      },
      {
        title: 'Civil Services Test Series',
        provider: 'Vision IAS',
        link: 'https://example.com/vision-ias',
        description: 'Practice test series for UPSC',
        isOnline: true
      },
      {
        title: 'Current Affairs Program',
        provider: 'Drishti IAS',
        link: 'https://example.com/drishti',
        description: 'Current affairs and news analysis',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'Lal Bahadur Shastri National Academy of Administration',
        location: 'Mussoorie',
        programs: ['Foundation Course', 'Professional Training'],
        link: 'https://example.com/lbsnaa',
        description: 'Premier training institute for IAS officers'
      },
      {
        name: 'Delhi University',
        location: 'Delhi',
        programs: ['BA/BSc/MA/MSc', 'Public Administration'],
        link: 'https://example.com/du',
        description: 'Leading university for civil services preparation'
      },
      {
        name: 'Jawaharlal Nehru University',
        location: 'New Delhi',
        programs: ['MA in Public Administration', 'International Relations'],
        link: 'https://example.com/jnu',
        description: 'Top university for policy studies'
      }
    ],
    articles: [
      {
        title: 'UPSC Preparation Strategy',
        author: 'Civil Services Review',
        link: 'https://example.com/upsc-strategy',
        description: 'Effective strategies for UPSC preparation',
        publishedDate: new Date('2024-01-30')
      },
      {
        title: 'Role of IAS Officers',
        author: 'Administrative Review',
        link: 'https://example.com/ias-role',
        description: 'Understanding the role of IAS officers',
        publishedDate: new Date('2024-02-15')
      },
      {
        title: 'Public Policy Making',
        author: 'Policy Review',
        link: 'https://example.com/policy-making',
        description: 'Process of policy formulation and implementation',
        publishedDate: new Date('2024-03-01')
      }
    ]
  },
  {
    title: 'Indian Police Service (IPS)',
    description: 'IPS officers maintain law and order, prevent and detect crime, and lead police forces across the country.',
    skills: ['Law Enforcement', 'Criminal Investigation', 'Leadership', 'Crisis Management', 'Public Safety', 'Team Management'],
    education: 'Bachelor\'s degree in any discipline',
    averageSalary: '₹56,100 - ₹2,25,000 per month (plus benefits)',
    jobOutlook: 'Stable (Regular recruitment through UPSC)',
    careerTraits: {
      leadership: 9,
      courage: 9,
      decisionMaking: 9,
      physicalFitness: 9,
      integrity: 9,
      problemSolving: 9
    },
    books: [
      {
        title: 'Indian Penal Code',
        author: 'Ratanlal & Dhirajlal',
        link: 'https://example.com/ipc',
        description: 'Comprehensive guide to criminal law.'
      },
      {
        title: 'Criminal Procedure Code',
        author: 'Ratanlal & Dhirajlal',
        link: 'https://example.com/crpc',
        description: 'Guide to criminal procedure.'
      },
      {
        title: 'Police Administration',
        author: 'S.L. Goel',
        link: 'https://example.com/police-admin',
        description: 'Principles of police administration.'
      }
    ],
    courses: [
      {
        title: 'UPSC Civil Services Preparation',
        provider: 'Sardar Vallabhbhai Patel National Police Academy',
        link: 'https://example.com/svpnpa',
        description: 'Professional training for IPS officers',
        isOnline: false
      },
      {
        title: 'Criminal Investigation',
        provider: 'National Police Academy',
        link: 'https://example.com/criminal-investigation',
        description: 'Advanced investigation techniques',
        isOnline: true
      },
      {
        title: 'Law Enforcement Leadership',
        provider: 'Bureau of Police Research and Development',
        link: 'https://example.com/bprd',
        description: 'Leadership in law enforcement',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'Sardar Vallabhbhai Patel National Police Academy',
        location: 'Hyderabad',
        programs: ['Foundation Course', 'Professional Training'],
        link: 'https://example.com/svpnpa',
        description: 'Premier training institute for IPS officers'
      },
      {
        name: 'National Police Academy',
        location: 'Hyderabad',
        programs: ['Advanced Training', 'Specialized Courses'],
        link: 'https://example.com/npa',
        description: 'Advanced training for police officers'
      },
      {
        name: 'Bureau of Police Research and Development',
        location: 'New Delhi',
        programs: ['Research Programs', 'Training Courses'],
        link: 'https://example.com/bprd',
        description: 'Research and development in policing'
      }
    ],
    articles: [
      {
        title: 'Modern Policing Techniques',
        author: 'Police Review',
        link: 'https://example.com/modern-policing',
        description: 'Contemporary policing methods',
        publishedDate: new Date('2024-02-01')
      },
      {
        title: 'Criminal Investigation Methods',
        author: 'Investigation Today',
        link: 'https://example.com/criminal-investigation',
        description: 'Advanced investigation techniques',
        publishedDate: new Date('2024-02-16')
      },
      {
        title: 'Police Leadership',
        author: 'Leadership Review',
        link: 'https://example.com/police-leadership',
        description: 'Leadership in law enforcement',
        publishedDate: new Date('2024-03-02')
      }
    ]
  },
  {
    title: 'Indian Foreign Service (IFS)',
    description: 'IFS officers represent India in international relations, handle diplomatic missions, and manage foreign policy.',
    skills: ['Diplomacy', 'International Relations', 'Foreign Policy', 'Negotiation', 'Languages', 'Cultural Understanding'],
    education: 'Bachelor\'s degree in any discipline',
    averageSalary: '₹56,100 - ₹2,25,000 per month (plus benefits)',
    jobOutlook: 'Stable (Regular recruitment through UPSC)',
    careerTraits: {
      diplomacy: 9,
      communication: 9,
      culturalAwareness: 9,
      negotiation: 9,
      adaptability: 9,
      analytical: 8
    },
    books: [
      {
        title: 'International Relations',
        author: 'P.M. Kamath',
        link: 'https://example.com/international-relations',
        description: 'Comprehensive guide to international relations.'
      },
      {
        title: 'Indian Foreign Policy',
        author: 'V.P. Dutt',
        link: 'https://example.com/foreign-policy',
        description: 'Analysis of India\'s foreign policy.'
      },
      {
        title: 'Diplomatic Practice',
        author: 'Kishan S. Rana',
        link: 'https://example.com/diplomatic-practice',
        description: 'Guide to diplomatic practices and protocols.'
      }
    ],
    courses: [
      {
        title: 'Foreign Service Training',
        provider: 'Foreign Service Institute',
        link: 'https://example.com/fsi',
        description: 'Professional training for IFS officers',
        isOnline: false
      },
      {
        title: 'International Relations',
        provider: 'Jawaharlal Nehru University',
        link: 'https://example.com/jnu-ir',
        description: 'Advanced international relations',
        isOnline: true
      },
      {
        title: 'Diplomatic Skills',
        provider: 'Indian Council of World Affairs',
        link: 'https://example.com/icwa',
        description: 'Diplomatic training and skills',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'Foreign Service Institute',
        location: 'New Delhi',
        programs: ['Foundation Course', 'Professional Training'],
        link: 'https://example.com/fsi',
        description: 'Premier training institute for IFS officers'
      },
      {
        name: 'Jawaharlal Nehru University',
        location: 'New Delhi',
        programs: ['MA in International Relations', 'Diplomatic Studies'],
        link: 'https://example.com/jnu',
        description: 'Leading university for international relations'
      },
      {
        name: 'Delhi University',
        location: 'Delhi',
        programs: ['MA in Political Science', 'International Relations'],
        link: 'https://example.com/du-ir',
        description: 'Top university for political science'
      }
    ],
    articles: [
      {
        title: 'Diplomatic Relations',
        author: 'Diplomacy Today',
        link: 'https://example.com/diplomatic-relations',
        description: 'Contemporary diplomatic practices',
        publishedDate: new Date('2024-02-05')
      },
      {
        title: 'Foreign Policy Analysis',
        author: 'Policy Review',
        link: 'https://example.com/foreign-policy-analysis',
        description: 'Analysis of foreign policy decisions',
        publishedDate: new Date('2024-02-20')
      },
      {
        title: 'International Diplomacy',
        author: 'International Review',
        link: 'https://example.com/international-diplomacy',
        description: 'Global diplomatic trends',
        publishedDate: new Date('2024-03-05')
      }
    ]
  }
]; 