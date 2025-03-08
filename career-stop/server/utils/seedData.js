const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Career = require('../models/Career');
const Question = require('../models/Question');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Sample career data
const careers = [
  {
    title: 'Software Developer',
    description: 'Software developers design, build, and maintain computer programs, applications, and systems that run on computers and other devices.',
    skills: ['Programming', 'Problem Solving', 'Logical Thinking', 'Attention to Detail', 'Teamwork'],
    educationRequirements: 'Bachelor\'s degree in Computer Science or related field',
    averageSalary: '$110,000 per year',
    jobOutlook: 'Growing much faster than average (22% growth from 2020-2030)',
    careerTraits: {
      analytical: 9,
      creative: 7,
      technical: 9,
      teamwork: 6,
      communication: 5,
      problemSolving: 9
    },
    books: [
      {
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        link: 'https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882',
        description: 'A must-read for any developer, this book focuses on the techniques and practices of writing clean, maintainable code.'
      },
      {
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt and David Thomas',
        link: 'https://www.amazon.com/Pragmatic-Programmer-journey-mastery-Anniversary/dp/0135957052',
        description: 'This book offers practical advice for programmers looking to improve their craft and career.'
      },
      {
        title: 'Code Complete',
        author: 'Steve McConnell',
        link: 'https://www.amazon.com/Code-Complete-Practical-Handbook-Construction/dp/0735619670',
        description: 'A comprehensive guide to software construction that provides practical advice on writing high-quality code.'
      },
      {
        title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
        author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
        link: 'https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612',
        description: 'A classic book on software design patterns that helps developers create more flexible, elegant, and reusable software.'
      },
      {
        title: 'Cracking the Coding Interview',
        author: 'Gayle Laakmann McDowell',
        link: 'https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/0984782850',
        description: 'A guide to preparing for technical interviews with practice problems and solutions.'
      }
    ],
    courses: [
      {
        title: 'Computer Science 101',
        provider: 'Stanford Online',
        link: 'https://online.stanford.edu/courses/soe-ycscs101-sp-computer-science-101',
        description: 'An introduction to the essential concepts of computer science.',
        isOnline: true
      },
      {
        title: 'Full Stack Web Development Bootcamp',
        provider: 'Udemy',
        link: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/',
        description: 'Learn to build web applications from scratch using modern technologies.',
        isOnline: true
      },
      {
        title: 'Data Structures and Algorithms Specialization',
        provider: 'Coursera',
        link: 'https://www.coursera.org/specializations/data-structures-algorithms',
        description: 'Master algorithmic programming techniques required for a career in software development.',
        isOnline: true
      },
      {
        title: 'Deep Learning Specialization',
        provider: 'Coursera (deeplearning.ai)',
        link: 'https://www.coursera.org/specializations/deep-learning',
        description: 'Learn the foundations of deep learning and build neural networks for various applications.',
        isOnline: true
      },
      {
        title: 'The Complete JavaScript Course',
        provider: 'Udemy',
        link: 'https://www.udemy.com/course/the-complete-javascript-course/',
        description: 'Master JavaScript with projects, challenges, and theory for modern web development.',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'Massachusetts Institute of Technology (MIT)',
        location: 'Cambridge, MA',
        programs: ['Computer Science', 'Electrical Engineering and Computer Science'],
        link: 'https://www.mit.edu/',
        description: 'One of the world\'s leading institutions for computer science education and research.'
      },
      {
        name: 'Stanford University',
        location: 'Stanford, CA',
        programs: ['Computer Science', 'Software Engineering'],
        link: 'https://www.stanford.edu/',
        description: 'Renowned for its computer science program and proximity to Silicon Valley.'
      },
      {
        name: 'Carnegie Mellon University',
        location: 'Pittsburgh, PA',
        programs: ['Computer Science', 'Software Engineering', 'Human-Computer Interaction'],
        link: 'https://www.cmu.edu/',
        description: 'Known for its strong computer science and robotics programs.'
      },
      {
        name: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        programs: ['Computer Science', 'Electrical Engineering and Computer Science'],
        link: 'https://www.berkeley.edu/',
        description: 'A top-ranked public university with excellent computer science programs.'
      },
      {
        name: 'Georgia Institute of Technology',
        location: 'Atlanta, GA',
        programs: ['Computer Science', 'Software Engineering', 'Computer Engineering'],
        link: 'https://www.gatech.edu/',
        description: 'Known for its strong engineering and computer science programs with excellent industry connections.'
      }
    ],
    articles: [
      {
        title: 'The Future of Software Development',
        author: 'Tech Insights',
        link: 'https://example.com/future-of-software-development',
        description: 'An exploration of emerging trends and technologies in software development.',
        publishedDate: new Date('2023-01-15')
      },
      {
        title: 'How to Become a Software Developer in 2023',
        author: 'Career Guide',
        link: 'https://example.com/become-software-developer-2023',
        description: 'A comprehensive guide to starting and advancing your career in software development.',
        publishedDate: new Date('2023-02-20')
      },
      {
        title: 'The Rise of AI in Software Development',
        author: 'Tech Review',
        link: 'https://example.com/ai-in-software-development',
        description: 'How artificial intelligence is transforming the way software is developed and maintained.',
        publishedDate: new Date('2023-03-10')
      },
      {
        title: 'Remote Work for Software Developers: Best Practices',
        author: 'Dev Lifestyle',
        link: 'https://example.com/remote-work-software-developers',
        description: 'Tips and strategies for effectively working remotely as a software developer.',
        publishedDate: new Date('2023-04-05')
      },
      {
        title: 'Microservices vs. Monoliths: Choosing the Right Architecture',
        author: 'Architecture Insights',
        link: 'https://example.com/microservices-vs-monoliths',
        description: 'A detailed comparison of different architectural approaches to building software systems.',
        publishedDate: new Date('2023-05-18')
      }
    ]
  },
  {
    title: 'Data Scientist',
    description: 'Data scientists analyze and interpret complex data to help organizations make better decisions.',
    skills: ['Statistics', 'Machine Learning', 'Programming', 'Data Visualization', 'Problem Solving'],
    educationRequirements: 'Master\'s or Ph.D. in Statistics, Computer Science, or related field',
    averageSalary: '$120,000 per year',
    jobOutlook: 'Growing much faster than average (31% growth from 2020-2030)',
    careerTraits: {
      analytical: 10,
      creative: 6,
      technical: 8,
      teamwork: 5,
      communication: 7,
      problemSolving: 9
    },
    books: [
      {
        title: 'Python for Data Analysis',
        author: 'Wes McKinney',
        link: 'https://www.amazon.com/Python-Data-Analysis-Wrangling-IPython/dp/1491957662',
        description: 'A comprehensive guide to using Python for data analysis tasks.'
      },
      {
        title: 'The Elements of Statistical Learning',
        author: 'Trevor Hastie, Robert Tibshirani, and Jerome Friedman',
        link: 'https://www.amazon.com/Elements-Statistical-Learning-Prediction-Statistics/dp/0387848576',
        description: 'A comprehensive introduction to statistical learning methods.'
      },
      {
        title: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow',
        author: 'Aurélien Géron',
        link: 'https://www.amazon.com/Hands-Machine-Learning-Scikit-Learn-TensorFlow/dp/1492032646',
        description: 'A practical guide to implementing machine learning algorithms with popular frameworks.'
      },
      {
        title: 'Deep Learning',
        author: 'Ian Goodfellow, Yoshua Bengio, and Aaron Courville',
        link: 'https://www.amazon.com/Deep-Learning-Adaptive-Computation-Machine/dp/0262035618',
        description: 'A comprehensive textbook on deep learning principles and techniques.'
      },
      {
        title: 'Storytelling with Data',
        author: 'Cole Nussbaumer Knaflic',
        link: 'https://www.amazon.com/Storytelling-Data-Visualization-Business-Professionals/dp/1119002257',
        description: 'A guide to effectively communicating insights through data visualization.'
      }
    ],
    courses: [
      {
        title: 'Data Science Specialization',
        provider: 'Coursera (Johns Hopkins University)',
        link: 'https://www.coursera.org/specializations/jhu-data-science',
        description: 'A comprehensive introduction to data science with R programming.',
        isOnline: true
      },
      {
        title: 'Machine Learning',
        provider: 'Stanford Online',
        link: 'https://www.coursera.org/learn/machine-learning',
        description: 'Andrew Ng\'s famous course on machine learning fundamentals.',
        isOnline: true
      },
      {
        title: 'Applied Data Science with Python Specialization',
        provider: 'Coursera (University of Michigan)',
        link: 'https://www.coursera.org/specializations/data-science-python',
        description: 'Learn to apply data science methods and techniques using Python.',
        isOnline: true
      },
      {
        title: 'Deep Learning Specialization',
        provider: 'Coursera (deeplearning.ai)',
        link: 'https://www.coursera.org/specializations/deep-learning',
        description: 'Master deep learning techniques and build neural networks.',
        isOnline: true
      },
      {
        title: 'Data Science Bootcamp',
        provider: 'General Assembly',
        link: 'https://generalassemb.ly/education/data-science-immersive',
        description: 'An intensive program covering the full data science workflow.',
        isOnline: false
      }
    ],
    colleges: [
      {
        name: 'Carnegie Mellon University',
        location: 'Pittsburgh, PA',
        programs: ['Master of Computational Data Science', 'Ph.D. in Machine Learning'],
        link: 'https://www.cmu.edu/',
        description: 'Known for its strong programs in computer science and data science.'
      },
      {
        name: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        programs: ['Master of Information and Data Science', 'Ph.D. in Statistics'],
        link: 'https://www.berkeley.edu/',
        description: 'Offers cutting-edge programs in data science and statistics.'
      },
      {
        name: 'Massachusetts Institute of Technology (MIT)',
        location: 'Cambridge, MA',
        programs: ['Master in Data Science', 'Ph.D. in Statistics and Data Science'],
        link: 'https://www.mit.edu/',
        description: 'One of the world\'s leading institutions for data science education and research.'
      },
      {
        name: 'Stanford University',
        location: 'Stanford, CA',
        programs: ['MS in Statistics: Data Science', 'Ph.D. in Computer Science (Machine Learning)'],
        link: 'https://www.stanford.edu/',
        description: 'Renowned for its data science and machine learning programs.'
      },
      {
        name: 'Harvard University',
        location: 'Cambridge, MA',
        programs: ['Master in Data Science', 'Ph.D. in Statistics'],
        link: 'https://www.harvard.edu/',
        description: 'Offers comprehensive programs in data science with a strong interdisciplinary approach.'
      }
    ],
    articles: [
      {
        title: 'The Role of Data Science in Modern Business',
        author: 'Business Analytics',
        link: 'https://example.com/data-science-in-business',
        description: 'How data science is transforming business decision-making.',
        publishedDate: new Date('2023-03-10')
      },
      {
        title: 'Ethical Considerations in Data Science',
        author: 'Tech Ethics',
        link: 'https://example.com/ethics-in-data-science',
        description: 'Exploring the ethical challenges and responsibilities in data science.',
        publishedDate: new Date('2023-01-05')
      },
      {
        title: 'The Future of AI and Machine Learning',
        author: 'AI Trends',
        link: 'https://example.com/future-of-ai-ml',
        description: 'Predictions and insights about the evolution of artificial intelligence and machine learning technologies.',
        publishedDate: new Date('2023-04-20')
      },
      {
        title: 'Big Data: Opportunities and Challenges',
        author: 'Data Insights',
        link: 'https://example.com/big-data-opportunities-challenges',
        description: 'An analysis of the potential benefits and difficulties associated with big data initiatives.',
        publishedDate: new Date('2023-02-15')
      },
      {
        title: 'From Data to Insights: The Data Science Process',
        author: 'Analytics Magazine',
        link: 'https://example.com/data-science-process',
        description: 'A step-by-step guide to turning raw data into actionable business insights.',
        publishedDate: new Date('2023-05-10')
      }
    ]
  },
  {
    title: 'UX/UI Designer',
    description: 'UX/UI designers create user-friendly and visually appealing interfaces for websites, apps, and other digital products.',
    skills: ['Visual Design', 'User Research', 'Wireframing', 'Prototyping', 'Information Architecture'],
    educationRequirements: 'Bachelor\'s degree in Design, Human-Computer Interaction, or related field',
    averageSalary: '$85,000 per year',
    jobOutlook: 'Growing faster than average (13% growth from 2020-2030)',
    careerTraits: {
      analytical: 7,
      creative: 9,
      technical: 6,
      teamwork: 7,
      communication: 8,
      problemSolving: 8
    },
    books: [
      {
        title: 'Don\'t Make Me Think',
        author: 'Steve Krug',
        link: 'https://www.amazon.com/Dont-Make-Think-Revisited-Usability/dp/0321965515',
        description: 'A common-sense approach to web and mobile usability.'
      },
      {
        title: 'The Design of Everyday Things',
        author: 'Don Norman',
        link: 'https://www.amazon.com/Design-Everyday-Things-Revised-Expanded/dp/0465050654',
        description: 'A seminal work on user-centered design principles.'
      },
      {
        title: 'Hooked: How to Build Habit-Forming Products',
        author: 'Nir Eyal',
        link: 'https://www.amazon.com/Hooked-How-Build-Habit-Forming-Products/dp/1591847788',
        description: 'A guide to designing products that form strong user habits.'
      },
      {
        title: 'About Face: The Essentials of Interaction Design',
        author: 'Alan Cooper',
        link: 'https://www.amazon.com/About-Face-Essentials-Interaction-Design/dp/1118766571',
        description: 'A comprehensive guide to interaction design principles and practices.'
      },
      {
        title: 'Emotional Design',
        author: 'Don Norman',
        link: 'https://www.amazon.com/Emotional-Design-Love-Everyday-Things/dp/0465051367',
        description: 'Explores how emotions influence user experience and design.'
      }
    ],
    courses: [
      {
        title: 'User Experience Research and Design Specialization',
        provider: 'Coursera (University of Michigan)',
        link: 'https://www.coursera.org/specializations/michiganux',
        description: 'A comprehensive program covering UX research and design methods.',
        isOnline: true
      },
      {
        title: 'UI / UX Design Bootcamp',
        provider: 'General Assembly',
        link: 'https://generalassemb.ly/education/user-experience-design-immersive',
        description: 'An intensive program focused on user experience design.',
        isOnline: false
      },
      {
        title: 'Interaction Design Specialization',
        provider: 'Coursera (University of California San Diego)',
        link: 'https://www.coursera.org/specializations/interaction-design',
        description: 'Learn to design effective human-computer interactions.',
        isOnline: true
      },
      {
        title: 'Design Thinking Specialization',
        provider: 'Coursera (University of Virginia)',
        link: 'https://www.coursera.org/specializations/uva-darden-design-thinking',
        description: 'Master design thinking methods for creative problem-solving.',
        isOnline: true
      },
      {
        title: 'Visual Elements of User Interface Design',
        provider: 'Coursera (California Institute of the Arts)',
        link: 'https://www.coursera.org/learn/visual-elements-user-interface-design',
        description: 'Learn the fundamental principles of visual design for interfaces.',
        isOnline: true
      }
    ],
    colleges: [
      {
        name: 'Rhode Island School of Design (RISD)',
        location: 'Providence, RI',
        programs: ['Graphic Design', 'Digital + Media'],
        link: 'https://www.risd.edu/',
        description: 'One of the top art and design schools in the United States.'
      },
      {
        name: 'Carnegie Mellon University',
        location: 'Pittsburgh, PA',
        programs: ['Human-Computer Interaction', 'Design for Interactions'],
        link: 'https://www.cmu.edu/',
        description: 'Known for its strong programs in HCI and design.'
      },
      {
        name: 'Parsons School of Design',
        location: 'New York, NY',
        programs: ['Communication Design', 'Design and Technology'],
        link: 'https://www.newschool.edu/parsons/',
        description: 'A leading design school with innovative programs in digital design.'
      },
      {
        name: 'Art Center College of Design',
        location: 'Pasadena, CA',
        programs: ['Graphic Design', 'Interaction Design'],
        link: 'https://www.artcenter.edu/',
        description: 'Focuses on preparing students for professional careers in design.'
      },
      {
        name: 'Savannah College of Art and Design (SCAD)',
        location: 'Savannah, GA',
        programs: ['User Experience Design', 'Interactive Design and Game Development'],
        link: 'https://www.scad.edu/',
        description: 'Offers comprehensive programs in various design disciplines.'
      }
    ],
    articles: [
      {
        title: 'The Evolution of User Experience Design',
        author: 'Design Trends',
        link: 'https://example.com/evolution-of-ux-design',
        description: 'How UX design has evolved over time and where it\'s heading.',
        publishedDate: new Date('2023-02-10')
      },
      {
        title: 'Designing for Accessibility: Best Practices',
        author: 'Inclusive Design',
        link: 'https://example.com/designing-for-accessibility',
        description: 'Guidelines for creating interfaces that work for all users.',
        publishedDate: new Date('2023-03-15')
      },
      {
        title: 'The Psychology of User Experience',
        author: 'UX Psychology',
        link: 'https://example.com/psychology-of-ux',
        description: 'How understanding human psychology can improve your design work.',
        publishedDate: new Date('2023-01-20')
      },
      {
        title: 'From Good to Great: Elevating Your UI Design Skills',
        author: 'Design Masters',
        link: 'https://example.com/elevating-ui-design-skills',
        description: 'Techniques and principles to take your interface designs to the next level.',
        publishedDate: new Date('2023-04-05')
      },
      {
        title: 'The Business Value of Good UX',
        author: 'Business Impact',
        link: 'https://example.com/business-value-of-good-ux',
        description: 'How investing in user experience design can drive business results.',
        publishedDate: new Date('2023-05-12')
      }
    ]
  }
];

// Generate 100 psychometric test questions
const generateTestQuestions = () => {
  const categories = ['interests', 'skills', 'personality'];
  const questions = [];
  
  // Interest-related questions
  const interestQuestions = [
    'Which activity do you enjoy the most?',
    'What would be your ideal way to spend a free afternoon?',
    'Which of these hobbies would you find most engaging?',
    'When reading, what type of content do you prefer?',
    'Which of these activities energizes you the most?',
    'What type of volunteer work would you find most fulfilling?',
    'Which subject would you be most interested in teaching to others?',
    'What type of museum would you prefer to visit?',
    'Which aspect of a project do you enjoy most?',
    'If you could attend a workshop, which topic would you choose?',
    'What type of online content do you consume most frequently?',
    'Which of these activities would you do in your free time?',
    'What kind of problems do you enjoy solving?',
    'Which of these YouTube channels would you likely subscribe to?',
    'What kind of events do you prefer attending?',
    'Which of these weekend activities sounds most appealing?',
    'When working on a group project, which role do you naturally take?',
    'What kind of apps do you use most frequently on your phone?',
    'If you could develop expertise in one area, what would it be?',
    'Which of these documentary topics would interest you most?',
    'If you had to write a book, what would it be about?',
    'Which section of a newspaper or news site do you read first?',
    'What kind of online course would you be most likely to take?',
    'Which of these TED Talk topics would you find most interesting?',
    'What kind of television shows do you prefer watching?',
    'If you had to start a blog, what would be its main focus?',
    'Which of these career paths seems most interesting to you?',
    'What kind of social media content do you enjoy creating?',
    'If you could shadow someone for a day, what profession would you choose?',
    'Which of these activities would you do on a rainy day?',
    'What type of podcasts do you enjoy listening to?',
    'Which of these creative activities appeals to you most?',
    'What type of community or club would you be most interested in joining?'
  ];
  
  // Skills-related questions
  const skillQuestions = [
    'Which of these skills do you believe you excel at?',
    'What type of problems are you best at solving?',
    'Which of these tasks would be easiest for you to accomplish?',
    'What skill have others complimented you on?',
    'Which of these activities do you feel most confident doing?',
    'In a group project, what task are you typically assigned?',
    'Which of these tools or software are you most comfortable using?',
    'What kind of tasks do you learn quickly?',
    'Which of these challenges would you find easiest to overcome?',
    'What subject did you perform best in during school?',
    'Which of these skills would you like to further develop?',
    'What task do others often ask for your help with?',
    'Which of these skills comes most naturally to you?',
    'In a crisis, what role do you typically take?',
    'Which of these abilities have served you well in your life?',
    'What kind of information do you find easy to remember?',
    'Which of these tasks would you be most confident teaching someone else?',
    'What skills have you developed in your personal projects?',
    'Which of these activities requires the least effort for you?',
    'What type of problems do you enjoy troubleshooting?',
    'Which of these skills do you rely on most in your daily life?',
    'What ability have you been praised for by teachers or supervisors?',
    'Which of these tasks would you prefer to handle in a team setting?',
    'What type of data or information do you find easiest to work with?',
    'Which of these skills have you developed most recently?',
    'What ability are you most proud of developing?',
    'Which of these activities would you feel most capable doing with limited guidance?',
    'What skill has been most valuable in your achievements so far?',
    'Which of these abilities would you consider your personal strength?',
    'What type of technical challenge would you feel confident tackling?',
    'Which of these competencies have you developed through formal training?',
    'What ability do you rely on when facing a challenging situation?',
    'Which of these tasks would you confidently add to your resume?'
  ];
  
  // Personality-related questions
  const personalityQuestions = [
    'When faced with a problem, you typically:',
    'In a group setting, you are usually:',
    'How do you prefer to make decisions?',
    'When starting a new project, you:',
    'How do you react to unexpected changes?',
    'When receiving feedback, you prefer it to be:',
    'When working on a task, you prefer:',
    'In social situations, you tend to:',
    'How do you feel about taking risks?',
    'When facing a deadline, you usually:',
    'When others disagree with you, how do you typically respond?',
    'How do you prefer to learn new information?',
    'When planning a trip, you tend to:',
    'How do you handle stressful situations?',
    'In your free time, you usually prefer:',
    'When working in a team, you value:',
    'How would your friends describe your communication style?',
    'When setting goals, you typically:',
    'How do you approach new challenges?',
    'When making a major decision, you primarily consider:',
    'How do you typically express your creativity?',
    'When conflicts arise, your approach is usually to:',
    'How do you prefer your work environment to be?',
    'When receiving praise, you typically:',
    'How do you respond to authority?',
    'When sharing ideas, you tend to:',
    'How do you handle criticism?',
    'What energizes you more?',
    'How do you prefer to communicate important information?',
    'When solving complex problems, your approach is typically:',
    'How do you react when your plans need to change suddenly?',
    'When meeting new people, you typically:',
    'How do you approach tasks that require attention to detail?',
    'When mentoring others, your style tends to be:'
  ];
  
  // Mapping questions to their respective categories
  const questionsByCategory = {
    interests: interestQuestions,
    skills: skillQuestions,
    personality: personalityQuestions
  };
  
  // Options for each category
  const optionsByCategory = {
    interests: [
      [
        { text: 'Creating or building things', score: new Map([['creative', 3], ['technical', 2], ['artistic', 2]]) },
        { text: 'Analyzing data and finding patterns', score: new Map([['analytical', 3], ['technical', 2], ['methodical', 2]]) },
        { text: 'Helping others learn or understand concepts', score: new Map([['teaching', 3], ['communication', 2], ['empathy', 2]]) },
        { text: 'Planning and organizing events or projects', score: new Map([['organization', 3], ['leadership', 2], ['practical', 2]]) }
      ],
      [
        { text: 'Reading and researching', score: new Map([['analytical', 2], ['curious', 3], ['independent', 2]]) },
        { text: 'Creating art or designing', score: new Map([['creative', 3], ['artistic', 3], ['visual', 2]]) },
        { text: 'Socializing with friends', score: new Map([['social', 3], ['communication', 2], ['extroverted', 2]]) },
        { text: 'Solving puzzles or strategic games', score: new Map([['analytical', 2], ['logical', 3], ['problemSolving', 2]]) }
      ],
      [
        { text: 'Technology and gadgets', score: new Map([['technical', 3], ['innovative', 2], ['analytical', 2]]) },
        { text: 'Arts and creative expressions', score: new Map([['artistic', 3], ['creative', 3], ['expressive', 2]]) },
        { text: 'Sports and physical activities', score: new Map([['physical', 3], ['competitive', 2], ['energetic', 2]]) },
        { text: 'Business and entrepreneurship', score: new Map([['leadership', 3], ['strategic', 2], ['ambitious', 2]]) }
      ]
    ],
    skills: [
      [
        { text: 'Technical skills (programming, data analysis, etc.)', score: new Map([['technical', 3], ['analytical', 2], ['methodical', 2]]) },
        { text: 'Communication and interpersonal skills', score: new Map([['communication', 3], ['empathy', 2], ['social', 2]]) },
        { text: 'Creative and artistic skills', score: new Map([['creative', 3], ['artistic', 3], ['visual', 2]]) },
        { text: 'Leadership and management skills', score: new Map([['leadership', 3], ['decisive', 2], ['strategic', 2]]) }
      ],
      [
        { text: 'Analyzing complex data', score: new Map([['analytical', 3], ['methodical', 2], ['technical', 2]]) },
        { text: 'Designing visual content', score: new Map([['visual', 3], ['creative', 2], ['artistic', 2]]) },
        { text: 'Persuading others through communication', score: new Map([['persuasive', 3], ['communication', 2], ['strategic', 2]]) },
        { text: 'Building and fixing things', score: new Map([['technical', 2], ['practical', 3], ['detail-oriented', 2]]) }
      ],
      [
        { text: 'Mathematical and logical problems', score: new Map([['logical', 3], ['analytical', 2], ['methodical', 2]]) },
        { text: 'Social and interpersonal challenges', score: new Map([['empathy', 3], ['social', 2], ['communication', 2]]) },
        { text: 'Creative and design challenges', score: new Map([['creative', 3], ['visual', 2], ['innovative', 2]]) },
        { text: 'Practical and hands-on problems', score: new Map([['practical', 3], ['physical', 2], ['technical', 2]]) }
      ]
    ],
    personality: [
      [
        { text: 'Analyze all available data before making a decision', score: new Map([['analytical', 3], ['methodical', 2], ['cautious', 2]]) },
        { text: 'Trust your intuition and make quick decisions', score: new Map([['intuitive', 3], ['decisive', 2], ['risk-taking', 2]]) },
        { text: 'Consult with others to get different perspectives', score: new Map([['collaborative', 3], ['social', 2], ['empathetic', 2]]) },
        { text: 'Look for creative or unconventional solutions', score: new Map([['creative', 3], ['innovative', 2], ['adaptable', 2]]) }
      ],
      [
        { text: 'The center of attention, leading discussions', score: new Map([['extroverted', 3], ['leadership', 2], ['confident', 2]]) },
        { text: 'A thoughtful observer, speaking when necessary', score: new Map([['introverted', 3], ['reflective', 2], ['observant', 2]]) },
        { text: 'A mediator, helping resolve conflicts', score: new Map([['diplomatic', 3], ['empathetic', 2], ['balanced', 2]]) },
        { text: 'A problem-solver, offering practical solutions', score: new Map([['practical', 3], ['problemSolving', 2], ['analytical', 2]]) }
      ],
      [
        { text: 'Based on logic and objective analysis', score: new Map([['logical', 3], ['analytical', 2], ['objective', 2]]) },
        { text: 'Based on how it will affect people involved', score: new Map([['empathetic', 3], ['considerate', 2], ['people-oriented', 2]]) },
        { text: 'Based on your values and what feels right', score: new Map([['principled', 3], ['intuitive', 2], ['values-driven', 2]]) },
        { text: 'Based on practical outcomes and efficiency', score: new Map([['practical', 3], ['efficient', 2], ['results-oriented', 2]]) }
      ]
    ]
  };
  
  // Generate 100 questions with appropriate options
  for (let i = 0; i < 100; i++) {
    const categoryIndex = i % 3; // Evenly distribute categories
    const category = categories[categoryIndex];
    
    // Select a question from the appropriate category
    const questionPool = questionsByCategory[category];
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
    
    // Import new data
    await Career.insertMany(careers);
    await Question.insertMany(questions);
    
    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete all data from DB
const destroyData = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await Career.deleteMany();
    await Question.deleteMany();
    
    console.log('Data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Determine which function to run based on command line args
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}; 