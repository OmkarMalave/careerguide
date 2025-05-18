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
    
    // Get related careers based on skills and education requirements
    const relatedCareers = await Career.find({
      _id: { $ne: career._id },
      $or: [
        { 'traits.skills': { $in: Object.keys(career.traits.skills) } },
        { 'education.degrees': { $in: career.education.degrees } }
      ]
    }).limit(3);

    // Initialize recommendations from career data
    const recommendations = {
      books: career.resources.books || [],
      courses: career.education.courses || [],
      colleges: career.education.topColleges || [],
      articles: career.resources.articles || [],
      websites: career.resources.websites || [],
      relatedCareers: relatedCareers.map(rc => ({
        id: rc._id,
        title: rc.title,
        description: rc.description,
        traits: rc.traits,
        education: rc.education
      }))
    };

    const desiredCounts = {
      books: 5,
      courses: 10,
      colleges: 20,
      articles: 5,
    };

    const placeholderTemplates = {
      books: [
        { title: "Foundational Readings in [Career]", author: "Various Experts", description: "Explore key texts to build a strong base in [Career]." },
        { title: "Advanced Topics in [Career]", author: "Specialists", description: "Delve into specialized subjects and cutting-edge research in [Career]." },
        { title: "Career Success Stories: [Career]", author: "Industry Leaders", description: "Gain inspiration from those who have excelled in [Career]." },
        { title: "Practical Guide to [Career] Skills", author: "Practitioners", description: "Develop essential hands-on skills for [Career]." },
        { title: "The Future of [Career]", author: "Futurists & Analysts", description: "Understand emerging trends and the evolving landscape of [Career]." }
      ],
      courses: [
        { title: "Comprehensive Overview of [Career]", provider: "Online Academies (e.g., Coursera, Udemy)", description: "A complete introduction to the field of [Career]." },
        { title: "Specialization Track: [Career]", provider: "University Platforms (e.g., edX)", description: "Focus on a specific niche within [Career] with this in-depth course." },
        { title: "Hands-on Workshop for [Career]", provider: "Industry Trainers", description: "Gain practical experience through interactive sessions for [Career]." },
        { title: "Certification Prep: [Career]", provider: "Professional Bodies", description: "Prepare for important industry certifications in [Career]." },
        { title: "Emerging Technologies in [Career]", provider: "Tech Institutes", description: "Learn about the latest tools and technologies shaping [Career]." },
        { title: "Essential Skills for [Career] Professionals", provider: "LinkedIn Learning", description: "Develop core competencies required in [Career]." },
        { title: "Masterclass: [Career] Insights", provider: "Expert Platforms", description: "Learn from seasoned professionals in the [Career] field." },
        { title: "Data Analysis for [Career]", provider: "Analytics Schools", description: "Understand how data drives decisions in [Career]." },
        { title: "Project Management in [Career]", provider: "PM Institutes", description: "Learn to manage projects effectively within the [Career] domain." },
        { title: "Communication Strategies for [Career]", provider: "Soft Skills Academies", description: "Enhance your communication abilities for success in [Career]." }
      ],
      articles: [
        { title: "Recent Trends in the [Career] Field", author: "Industry Journals", description: "Stay updated with the latest developments and trends in [Career]." },
        { title: "A Day in the Life of a [Career] Professional", author: "Career Blogs", description: "Get insights into the day-to-day realities of working in [Career]." },
        { title: "Key Challenges and Opportunities in [Career]", author: "Market Analysts", description: "Understand the current landscape and future prospects for [Career]." },
        { title: "Networking Tips for [Career] Aspirants", author: "Professional Coaches", description: "Learn how to build valuable connections in the [Career] industry." },
        { title: "Essential Tools and Technologies for [Career]", author: "Tech Reviewers", description: "Discover the must-have software and tools for [Career] professionals." }
      ],
      colleges: [
        { name: "Top University for [Career] Programs", location: "Global", programs: ["[Career] Studies"], description: "Explore leading universities known for their strong [Career] departments." },
        { name: "Specialized Institute for [Career]", location: "National", programs: ["Advanced [Career] Diploma"], description: "Consider institutions focused specifically on training for [Career] roles." },
        { name: "Online Degree in [Career]", location: "Remote", programs: ["B.Sc. in [Career] (Online)"], description: "Flexible online degree options for aspiring [Career] professionals." },
        { name: "Community College Pathway to [Career]", location: "Local", programs: ["Associate in [Career]"], description: "Affordable pathways to start your journey in the [Career] field." },
        { name: "Vocational School for [Career] Skills", location: "Regional", programs: ["[Career] Certification"], description: "Practical, hands-on training for specific [Career] skillsets." }
        // Add 15 more varied college templates if needed to reach 20 unique ones.
        // For brevity here, only 5 are listed. The logic will cycle these.
      ]
    };

    const generateSearchLink = (type, query) => {
      const encodedQuery = encodeURIComponent(query);
      switch (type) {
        case 'books':
          return `https://www.google.com/search?q=${encodedQuery}+books`;
        case 'courses':
          return `https://www.udemy.com/courses/search/?q=${encodedQuery}`;
        case 'articles':
          return `https://www.google.com/search?q=${encodedQuery}+career+articles`;
        case 'colleges':
          return `https://www.google.com/search?q=${encodedQuery}+college+programs`;
        default:
          return '#';
      }
    };

    // Pad books if necessary
    if (recommendations.books.length < desiredCounts.books) {
      const itemsToAdd = desiredCounts.books - recommendations.books.length;
      for (let i = 0; i < itemsToAdd; i++) {
        const template = placeholderTemplates.books[recommendations.books.length % placeholderTemplates.books.length];
        recommendations.books.push({
          ...template,
          title: template.title.replace('[Career]', career.title),
          description: template.description.replace('[Career]', career.title),
          link: generateSearchLink('books', career.title)
        });
      }
    }

    // Pad courses if necessary
    if (recommendations.courses.length < desiredCounts.courses) {
      const itemsToAdd = desiredCounts.courses - recommendations.courses.length;
      for (let i = 0; i < itemsToAdd; i++) {
        const template = placeholderTemplates.courses[recommendations.courses.length % placeholderTemplates.courses.length];
        recommendations.courses.push({
          ...template,
          title: template.title.replace('[Career]', career.title),
          description: template.description.replace('[Career]', career.title),
          isOnline: true, // Assuming default placeholder courses are online
          link: generateSearchLink('courses', career.title)
        });
      }
    }

    // Pad colleges if necessary
    // Note: For 20 colleges, we'd ideally have 20 unique templates or a more dynamic generation.
    // The current logic will cycle through the provided templates.
    if (recommendations.colleges.length < desiredCounts.colleges) {
      const itemsToAdd = desiredCounts.colleges - recommendations.colleges.length;
      const collegeTemplates = placeholderTemplates.colleges.length > 0 ? placeholderTemplates.colleges : [{ name: "Institution for [Career]", location: "Various Locations", programs: ["[Career] Focus"], description: "Explore institutions offering programs in [Career]."}];
      for (let i = 0; i < itemsToAdd; i++) {
        const template = collegeTemplates[recommendations.colleges.length % collegeTemplates.length];
        recommendations.colleges.push({
          ...template,
          name: template.name.replace('[Career]', career.title),
          description: template.description.replace('[Career]', career.title),
          programs: template.programs.map(p => p.replace('[Career]', career.title)),
          link: generateSearchLink('colleges', career.title)
        });
      }
    }

    // Pad articles if necessary
    if (recommendations.articles.length < desiredCounts.articles) {
      const itemsToAdd = desiredCounts.articles - recommendations.articles.length;
      for (let i = 0; i < itemsToAdd; i++) {
        const template = placeholderTemplates.articles[recommendations.articles.length % placeholderTemplates.articles.length];
        recommendations.articles.push({
          ...template,
          title: template.title.replace('[Career]', career.title),
          description: template.description.replace('[Career]', career.title),
          publishedDate: new Date(),
          link: generateSearchLink('articles', career.title)
        });
      }
    }
    
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

// @desc    Get personalized recommendations based on user profile
// @route   GET /api/recommendations/personalized
// @access  Private
exports.getPersonalizedRecommendations = async (req, res) => {
  try {
    const { educationLevel, interests, skills } = req.user;
    
    // Find careers matching user's education level
    let careers = await Career.find({
      educationRequirements: { 
        $regex: new RegExp(educationLevel, 'i')
      }
    });

    // Score careers based on multiple factors
    const scoredCareers = careers.map(career => {
      let score = 0;
      let skillsScore = 0;
      let interestsScore = 0;
      let educationScore = 0;
      
      // 1. Skills Match (40% weight)
      const skillsMatch = career.skills.filter(
        skill => skills.includes(skill.toLowerCase())
      ).length;
      skillsScore = (skillsMatch / career.skills.length) * 40;
      
      // 2. Interests Match (30% weight)
      if (career.careerTraits) {
        const interestMatch = Object.keys(interests).reduce((acc, interest) => {
          if (career.careerTraits[interest]) {
            // Calculate how well the interest matches (0-10 scale)
            const matchQuality = 10 - Math.abs(interests[interest] - career.careerTraits[interest]);
            return acc + matchQuality;
          }
          return acc;
        }, 0);
        interestsScore = (interestMatch / (Object.keys(interests).length * 10)) * 30;
      }
      
      // 3. Education Level Match (30% weight)
      const educationLevels = {
        '10th': 1,
        '12th': 2,
        'Bachelor': 3,
        'Master': 4,
        'PhD': 5
      };
      
      const userEducationLevel = educationLevels[educationLevel] || 0;
      const careerEducationLevel = educationLevels[career.educationRequirements.split(' ')[0]] || 0;
      
      // Perfect match gets full points, one level difference gets 80%, two levels gets 60%
      const educationDiff = Math.abs(userEducationLevel - careerEducationLevel);
      educationScore = educationDiff === 0 ? 30 : 
                      educationDiff === 1 ? 24 : 
                      educationDiff === 2 ? 18 : 0;
      
      // Calculate total score
      score = skillsScore + interestsScore + educationScore;
      
      return {
        career,
        score,
        skillsScore,
        interestsScore,
        educationScore,
        matchedSkills: career.skills.filter(skill => skills.includes(skill.toLowerCase())),
        matchedInterests: Object.keys(interests).filter(interest => 
          career.careerTraits && career.careerTraits[interest]
        )
      };
    });

    // Apply strict filtering criteria
    const recommendations = scoredCareers
      .filter(item => {
        // Must have at least 60% overall score
        const hasGoodOverallScore = item.score >= 60;
        
        // Must have at least 50% skills match
        const hasGoodSkillsMatch = item.skillsScore >= 20;
        
        // Must have at least 2 matched skills
        const hasEnoughMatchedSkills = item.matchedSkills.length >= 2;
        
        // Must have at least 1 matched interest
        const hasMatchedInterests = item.matchedInterests.length >= 1;
        
        return hasGoodOverallScore && hasGoodSkillsMatch && hasEnoughMatchedSkills && hasMatchedInterests;
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4) // Limit to top 4 recommendations
      .map(item => ({
        id: item.career._id,
        title: item.career.title,
        description: item.career.description,
        skills: item.career.skills,
        averageSalary: item.career.averageSalary,
        jobOutlook: item.career.jobOutlook,
        matchScore: Math.round(item.score),
        skillsMatchScore: Math.round(item.skillsScore),
        interestsMatchScore: Math.round(item.interestsScore),
        educationMatchScore: Math.round(item.educationScore),
        matchReason: getEnhancedMatchReason(item)
      }));

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

// Enhanced helper function to generate detailed match reasons
const getEnhancedMatchReason = (item) => {
  const reasons = [];
  
  // Add skills match reason
  if (item.matchedSkills.length > 0) {
    reasons.push(`Strong match with ${item.matchedSkills.length} of your skills: ${item.matchedSkills.join(', ')}`);
  }
  
  // Add interests match reason
  if (item.matchedInterests.length > 0) {
    reasons.push(`Aligns with your interests in: ${item.matchedInterests.join(', ')}`);
  }
  
  // Add education match reason
  if (item.educationScore >= 24) {
    reasons.push('Matches your education level well');
  }
  
  return reasons.join('. ');
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
      count: career.resources.books.length,
      data: career.resources.books
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
      count: career.education.courses.length,
      data: career.education.courses
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
      count: career.education.topColleges.length,
      data: career.education.topColleges
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
      count: career.resources.articles.length,
      data: career.resources.articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
}; 