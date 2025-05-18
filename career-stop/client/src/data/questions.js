import { careerCategories } from './seedData';

export { careerCategories };

export const questions = [
  // Personality Type (Big Five inspired)
  {
    id: 1,
    category: 'personality',
    text: 'I enjoy trying new things and exploring different ideas',
    trait: 'openness',
    weight: 1,
    subcategory: 'creativity'
  },
  {
    id: 2,
    category: 'personality',
    text: 'I am organized and pay attention to details',
    trait: 'conscientiousness',
    weight: 1,
    subcategory: 'organization'
  },
  {
    id: 3,
    category: 'personality',
    text: 'I feel energized when spending time with others',
    trait: 'extraversion',
    weight: 1,
    subcategory: 'social_energy'
  },
  {
    id: 4,
    category: 'personality',
    text: 'I handle stress and pressure well',
    trait: 'neuroticism',
    weight: 1,
    subcategory: 'stress_management'
  },

  // Interest Type (RIASEC categories)
  {
    id: 5,
    category: 'interests',
    text: 'I enjoy working with tools and machines',
    trait: 'realistic',
    weight: 1,
    subcategory: 'technical_skills'
  },
  {
    id: 6,
    category: 'interests',
    text: 'I like solving complex problems',
    trait: 'investigative',
    weight: 1,
    subcategory: 'problem_solving'
  },
  {
    id: 7,
    category: 'interests',
    text: 'I enjoy creating art or music',
    trait: 'artistic',
    weight: 1,
    subcategory: 'creative_expression'
  },
  {
    id: 8,
    category: 'interests',
    text: 'I like helping others learn and grow',
    trait: 'social',
    weight: 1,
    subcategory: 'teaching'
  },
  {
    id: 9,
    category: 'interests',
    text: 'I enjoy leading and persuading others',
    trait: 'enterprising',
    weight: 1,
    subcategory: 'leadership'
  },

  // Skill Type (Self-rated confidence)
  {
    id: 10,
    category: 'skills',
    text: 'I am good at explaining things to others',
    trait: 'communication',
    weight: 1,
    subcategory: 'verbal_communication'
  },
  {
    id: 11,
    category: 'skills',
    text: 'I can analyze data and find patterns',
    trait: 'analytical',
    weight: 1,
    subcategory: 'data_analysis'
  },
  {
    id: 12,
    category: 'skills',
    text: 'I am comfortable using technology',
    trait: 'technical',
    weight: 1,
    subcategory: 'tech_adaptability'
  },
  {
    id: 13,
    category: 'skills',
    text: 'I can come up with creative solutions',
    trait: 'creative',
    weight: 1,
    subcategory: 'problem_solving'
  },

  // Values Type (What motivates you)
  {
    id: 14,
    category: 'values',
    text: 'Making a positive impact on others is important to me',
    trait: 'impact',
    weight: 1,
    subcategory: 'social_impact'
  },
  {
    id: 15,
    category: 'values',
    text: 'Having a stable and secure job is important',
    trait: 'stability',
    weight: 1,
    subcategory: 'job_security'
  },
  {
    id: 16,
    category: 'values',
    text: 'Earning a high income is important to me',
    trait: 'income',
    weight: 1,
    subcategory: 'financial_goals'
  },
  {
    id: 17,
    category: 'values',
    text: 'Having opportunities to learn and grow is important',
    trait: 'growth',
    weight: 1,
    subcategory: 'development'
  },

  // Work Style & Environment Preferences
  {
    id: 18,
    category: 'workStyle',
    text: 'I prefer working in a team environment',
    trait: 'teamwork',
    weight: 1,
    subcategory: 'collaboration'
  },
  {
    id: 19,
    category: 'workStyle',
    text: 'I work best with clear structure and guidelines',
    trait: 'structure',
    weight: 1,
    subcategory: 'organization'
  },
  {
    id: 20,
    category: 'workStyle',
    text: 'I enjoy fast-paced and dynamic work environments',
    trait: 'dynamic',
    weight: 1,
    subcategory: 'pace'
  }
];

export const calculateCareerMatch = (answers) => {
  // Calculate trait scores for each category and subcategory
  const traitScores = {
    personality: calculateTraitMatch(answers, 'personality', {}),
    interests: calculateTraitMatch(answers, 'interests', {}),
    skills: calculateTraitMatch(answers, 'skills', {}),
    values: calculateTraitMatch(answers, 'values', {}),
    workStyle: calculateTraitMatch(answers, 'workStyle', {})
  };

  // Calculate match scores for each career with enhanced weighting
  const careerMatches = careerCategories.map(career => {
    const traitMatches = {
      personality: calculateTraitMatch(answers, 'personality', career.traits.personality),
      interests: calculateTraitMatch(answers, 'interests', career.traits.interests),
      skills: calculateTraitMatch(answers, 'skills', career.traits.skills),
      values: calculateTraitMatch(answers, 'values', career.traits.values),
      workStyle: calculateTraitMatch(answers, 'workStyle', career.traits.workStyle)
    };

    // Enhanced weighting system
    const weights = {
      personality: 0.25,
      interests: 0.30,
      skills: 0.25,
      values: 0.15,
      workStyle: 0.05
    };

    // Calculate weighted match score
    const matchScore = Object.keys(traitMatches).reduce((score, category) => {
      return score + (traitMatches[category] * weights[category]);
    }, 0);

    return {
      career,
      matchScore,
      traitMatches,
      strengths: getTopTraits(traitMatches),
      areasForImprovement: getAreasForImprovement(traitMatches)
    };
  });

  // Sort careers by match score
  return careerMatches.sort((a, b) => b.matchScore - a.matchScore);
};

// Helper function to calculate trait matches with subcategories
const calculateTraitMatch = (answers, category, careerTraits) => {
  const categoryQuestions = questions.filter(q => q.category === category);
  const traitScores = {};

  categoryQuestions.forEach(question => {
    const answer = answers[question.id];
    if (answer) {
      const trait = question.trait;
      const subcategory = question.subcategory;
      
      if (!traitScores[trait]) {
        traitScores[trait] = { total: 0, count: 0, subcategories: {} };
      }
      
      traitScores[trait].total += answer * question.weight;
      traitScores[trait].count += question.weight;
      
      if (!traitScores[trait].subcategories[subcategory]) {
        traitScores[trait].subcategories[subcategory] = { total: 0, count: 0 };
      }
      
      traitScores[trait].subcategories[subcategory].total += answer * question.weight;
      traitScores[trait].subcategories[subcategory].count += question.weight;
    }
  });

  // Calculate average scores for each trait and subcategory
  Object.keys(traitScores).forEach(trait => {
    traitScores[trait].average = traitScores[trait].total / traitScores[trait].count;
    
    Object.keys(traitScores[trait].subcategories).forEach(subcategory => {
      const sub = traitScores[trait].subcategories[subcategory];
      sub.average = sub.total / sub.count;
    });
  });

  return traitScores;
};

// Enhanced function to get top traits
const getTopTraits = (traitMatches) => {
  const strengths = [];
  
  Object.entries(traitMatches).forEach(([category, traits]) => {
    Object.entries(traits).forEach(([trait, data]) => {
      if (data.average >= 0.7) {
        strengths.push({
          category,
          trait,
          score: data.average,
          subcategories: Object.entries(data.subcategories)
            .filter(([_, sub]) => sub.average >= 0.7)
            .map(([sub, data]) => ({ name: sub, score: data.average }))
        });
      }
    });
  });

  return strengths.sort((a, b) => b.score - a.score);
};

// Enhanced function to get areas for improvement
const getAreasForImprovement = (traitMatches) => {
  const areas = [];
  
  Object.entries(traitMatches).forEach(([category, traits]) => {
    Object.entries(traits).forEach(([trait, data]) => {
      if (data.average < 0.5) {
        areas.push({
          category,
          trait,
          score: data.average,
          subcategories: Object.entries(data.subcategories)
            .filter(([_, sub]) => sub.average < 0.5)
            .map(([sub, data]) => ({ name: sub, score: data.average }))
        });
      }
    });
  });

  return areas.sort((a, b) => a.score - b.score);
}; 