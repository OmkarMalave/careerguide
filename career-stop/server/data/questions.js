const questions = [
  {
    text: "How do you feel about working in a team environment?",
    category: "workStyle",
    options: [
      { text: "I strongly prefer working alone", score: 1 },
      { text: "I prefer working alone but can work in a team", score: 2 },
      { text: "I'm comfortable with both", score: 3 },
      { text: "I prefer working in a team", score: 4 },
      { text: "I strongly prefer working in a team", score: 5 }
    ],
    active: true
  },
  {
    text: "How do you handle deadlines and pressure?",
    category: "workStyle",
    options: [
      { text: "I get very stressed", score: 1 },
      { text: "I get somewhat stressed", score: 2 },
      { text: "I handle it okay", score: 3 },
      { text: "I handle it well", score: 4 },
      { text: "I thrive under pressure", score: 5 }
    ],
    active: true
  },
  {
    text: "How interested are you in solving complex problems?",
    category: "interests",
    options: [
      { text: "Not interested at all", score: 1 },
      { text: "Somewhat interested", score: 2 },
      { text: "Moderately interested", score: 3 },
      { text: "Very interested", score: 4 },
      { text: "Extremely interested", score: 5 }
    ],
    active: true
  },
  {
    text: "How do you feel about public speaking?",
    category: "skills",
    options: [
      { text: "I avoid it completely", score: 1 },
      { text: "I'm very uncomfortable", score: 2 },
      { text: "I'm somewhat comfortable", score: 3 },
      { text: "I'm comfortable", score: 4 },
      { text: "I enjoy it", score: 5 }
    ],
    active: true
  },
  {
    text: "How important is work-life balance to you?",
    category: "values",
    options: [
      { text: "Not important at all", score: 1 },
      { text: "Somewhat important", score: 2 },
      { text: "Moderately important", score: 3 },
      { text: "Very important", score: 4 },
      { text: "Extremely important", score: 5 }
    ],
    active: true
  },
  {
    text: "How do you feel about taking risks?",
    category: "personality",
    options: [
      { text: "I avoid risks completely", score: 1 },
      { text: "I prefer to avoid risks", score: 2 },
      { text: "I'm neutral about risks", score: 3 },
      { text: "I'm comfortable with calculated risks", score: 4 },
      { text: "I enjoy taking risks", score: 5 }
    ],
    active: true
  },
  {
    text: "How do you feel about learning new technologies?",
    category: "interests",
    options: [
      { text: "I avoid it completely", score: 1 },
      { text: "I'm not very interested", score: 2 },
      { text: "I'm somewhat interested", score: 3 },
      { text: "I'm very interested", score: 4 },
      { text: "I love learning new technologies", score: 5 }
    ],
    active: true
  },
  {
    text: "How do you feel about working with data?",
    category: "skills",
    options: [
      { text: "I avoid it completely", score: 1 },
      { text: "I'm not comfortable", score: 2 },
      { text: "I'm somewhat comfortable", score: 3 },
      { text: "I'm comfortable", score: 4 },
      { text: "I enjoy working with data", score: 5 }
    ],
    active: true
  },
  {
    text: "How important is job security to you?",
    category: "values",
    options: [
      { text: "Not important at all", score: 1 },
      { text: "Somewhat important", score: 2 },
      { text: "Moderately important", score: 3 },
      { text: "Very important", score: 4 },
      { text: "Extremely important", score: 5 }
    ],
    active: true
  },
  {
    text: "How do you feel about working independently?",
    category: "workStyle",
    options: [
      { text: "I strongly prefer supervision", score: 1 },
      { text: "I prefer some supervision", score: 2 },
      { text: "I'm comfortable either way", score: 3 },
      { text: "I prefer working independently", score: 4 },
      { text: "I strongly prefer working independently", score: 5 }
    ],
    active: true
  },
  {
    text: "How do you feel about creative problem-solving?",
    category: "skills",
    options: [
      { text: "I avoid it completely", score: 1 },
      { text: "I'm not very good at it", score: 2 },
      { text: "I'm somewhat good at it", score: 3 },
      { text: "I'm good at it", score: 4 },
      { text: "I excel at it", score: 5 }
    ],
    active: true
  },
  {
    text: "How important is helping others to you?",
    category: "values",
    options: [
      { text: "Not important at all", score: 1 },
      { text: "Somewhat important", score: 2 },
      { text: "Moderately important", score: 3 },
      { text: "Very important", score: 4 },
      { text: "Extremely important", score: 5 }
    ],
    active: true
  },
  {
    text: "How do you feel about working with people?",
    category: "personality",
    options: [
      { text: "I strongly prefer not to", score: 1 },
      { text: "I prefer not to", score: 2 },
      { text: "I'm neutral", score: 3 },
      { text: "I enjoy it", score: 4 },
      { text: "I strongly enjoy it", score: 5 }
    ],
    active: true
  },
  {
    text: "How do you feel about following strict procedures?",
    category: "workStyle",
    options: [
      { text: "I strongly dislike it", score: 1 },
      { text: "I somewhat dislike it", score: 2 },
      { text: "I'm neutral", score: 3 },
      { text: "I somewhat prefer it", score: 4 },
      { text: "I strongly prefer it", score: 5 }
    ],
    active: true
  },
  {
    text: "How important is career growth to you?",
    category: "values",
    options: [
      { text: "Not important at all", score: 1 },
      { text: "Somewhat important", score: 2 },
      { text: "Moderately important", score: 3 },
      { text: "Very important", score: 4 },
      { text: "Extremely important", score: 5 }
    ],
    active: true
  },
  {
    text: "How do you feel about working with numbers?",
    category: "skills",
    options: [
      { text: "I avoid it completely", score: 1 },
      { text: "I'm not comfortable", score: 2 },
      { text: "I'm somewhat comfortable", score: 3 },
      { text: "I'm comfortable", score: 4 },
      { text: "I enjoy working with numbers", score: 5 }
    ],
    active: true
  },
  {
    text: "How do you feel about working in a fast-paced environment?",
    category: "workStyle",
    options: [
      { text: "I strongly prefer a slow pace", score: 1 },
      { text: "I prefer a slow pace", score: 2 },
      { text: "I'm comfortable with either", score: 3 },
      { text: "I prefer a fast pace", score: 4 },
      { text: "I strongly prefer a fast pace", score: 5 }
    ],
    active: true
  },
  {
    text: "How important is work environment to you?",
    category: "values",
    options: [
      { text: "Not important at all", score: 1 },
      { text: "Somewhat important", score: 2 },
      { text: "Moderately important", score: 3 },
      { text: "Very important", score: 4 },
      { text: "Extremely important", score: 5 }
    ],
    active: true
  },
  {
    text: "How do you feel about working with technology?",
    category: "interests",
    options: [
      { text: "I avoid it completely", score: 1 },
      { text: "I'm not very interested", score: 2 },
      { text: "I'm somewhat interested", score: 3 },
      { text: "I'm very interested", score: 4 },
      { text: "I love working with technology", score: 5 }
    ],
    active: true
  },
  {
    text: "How do you feel about working with deadlines?",
    category: "workStyle",
    options: [
      { text: "I strongly dislike it", score: 1 },
      { text: "I somewhat dislike it", score: 2 },
      { text: "I'm neutral", score: 3 },
      { text: "I somewhat prefer it", score: 4 },
      { text: "I strongly prefer it", score: 5 }
    ],
    active: true
  }
];

module.exports = questions; 