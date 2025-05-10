import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { testAPI } from '../utils/api';

const PsychometricTest = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [showEducationSelection, setShowEducationSelection] = useState(true);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await testAPI.getQuestions();
        setQuestions(response.data.data);
        // Initialize answers array with empty values
        setAnswers(new Array(response.data.data.length).fill(null));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load test questions. Please try again later.');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleOptionSelect = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      question: questions[currentQuestionIndex]._id,
      selectedOption: optionIndex
    };
    setAnswers(newAnswers);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitTest = async () => {
    // Check if all questions are answered
    const unansweredQuestions = answers.findIndex(answer => answer === null);
    if (unansweredQuestions !== -1) {
      setError(`Please answer question ${unansweredQuestions + 1} before submitting.`);
      setCurrentQuestionIndex(unansweredQuestions);
      return;
    }

    try {
      setSubmitting(true);
      const response = await testAPI.submitTest({
        answers,
        educationLevel
      });
      navigate('/test/results', { state: { testResult: response.data.data } });
    } catch (err) {
      console.error('Error submitting test:', err);
      setError('Failed to submit test. Please try again.');
      setSubmitting(false);
    }
  };

  const handleEducationLevelSelect = (level) => {
    setEducationLevel(level);
    setShowEducationSelection(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Psychometric Test</h1>
        <p className="text-lg text-gray-600 mb-8">
          No questions available at the moment. Please try again later.
        </p>
      </div>
    );
  }

  if (showEducationSelection) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">Select Your Education Level</h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          Please select your current education level to help us provide more relevant career recommendations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {educationalLevels.map((level) => (
            <div
              key={level.level}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-md ${
                educationLevel === level.level
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
              }`}
              onClick={() => handleEducationLevelSelect(level.level)}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">{level.level}</h3>
              <p className="text-gray-600 mb-4">{level.description}</p>
              <div className="flex flex-wrap gap-2">
                {level.streams.map((stream) => (
                  <span
                    key={stream}
                    className="bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-0.5 rounded-full"
                  >
                    {stream}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">Psychometric Test</h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        Answer the following questions to discover career paths that match your
        personality, interests, and skills.
      </p>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 font-medium">
          <p>{error}</p>
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-2">
        <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div
            className="bg-primary-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white shadow-lg rounded-lg border border-gray-100 p-8 mb-8">
        <div className="mb-6">
          <span className="inline-block bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full mb-3">
            {currentQuestion.category.charAt(0).toUpperCase() + currentQuestion.category.slice(1)}
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentQuestion.text}</h2>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className={`border-2 rounded-lg p-5 cursor-pointer transition-all hover:shadow-md ${
                answers[currentQuestionIndex]?.selectedOption === index
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
              }`}
              onClick={() => handleOptionSelect(index)}
            >
              <div className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                    answers[currentQuestionIndex]?.selectedOption === index
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300'
                  }`}
                >
                  {answers[currentQuestionIndex]?.selectedOption === index && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="text-lg text-gray-800 font-medium">{option.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {currentQuestionIndex < questions.length - 1 ? (
          <button
            onClick={goToNextQuestion}
            disabled={answers[currentQuestionIndex] === null}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmitTest}
            disabled={submitting || answers.includes(null)}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Test'}
          </button>
        )}
      </div>
      
      <div className="text-center mt-8 text-gray-500 text-sm">
        <p>You've answered {answers.filter(a => a !== null).length} out of {questions.length} questions.</p>
        <p className="mt-1">Please answer all questions to get accurate career recommendations.</p>
      </div>
    </div>
  );
};

export default PsychometricTest; 