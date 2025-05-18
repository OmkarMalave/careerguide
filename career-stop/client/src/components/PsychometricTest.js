import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PsychometricTest = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 1,
      text: "I enjoy working with numbers and solving mathematical problems.",
      category: "analytical"
    },
    {
      id: 2,
      text: "I prefer working in a team rather than alone.",
      category: "social"
    },
    {
      id: 3,
      text: "I am comfortable with public speaking and presentations.",
      category: "communication"
    },
    {
      id: 4,
      text: "I enjoy creating and designing things.",
      category: "creative"
    },
    {
      id: 5,
      text: "I like to analyze data and find patterns.",
      category: "analytical"
    }
  ];

  const handleAnswer = (value) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: value
    });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Navigate to results page when test is complete
      navigate('/test/results', { state: { answers } });
    }
  };

  if (currentQuestion >= questions.length) {
    return null;
  }

  return (
    <div className="min-h-screen bg-theme-bg-dark text-theme-text-DEFAULT p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Career Aptitude Test</h1>
        
        <div className="bg-theme-bg-light p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <span className="text-theme-text-muted">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          
          <p className="text-xl mb-8">{questions[currentQuestion].text}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer(1)}
              className="bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg transition-colors"
            >
              Strongly Disagree
            </button>
            <button
              onClick={() => handleAnswer(2)}
              className="bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg transition-colors"
            >
              Disagree
            </button>
            <button
              onClick={() => handleAnswer(3)}
              className="bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg transition-colors"
            >
              Agree
            </button>
            <button
              onClick={() => handleAnswer(4)}
              className="bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg transition-colors"
            >
              Strongly Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsychometricTest; 