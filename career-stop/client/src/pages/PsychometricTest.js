import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { testAPI } from '../utils/api';
import { questions, calculateCareerMatch } from '../data/questions';

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
      selectedOption: optionIndex,
      category: questions[currentQuestionIndex].category
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

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError('');
      
      // Validate all questions are answered
      const unansweredQuestions = answers.filter(answer => !answer || answer.selectedOption === undefined);
      if (unansweredQuestions.length > 0) {
        setError('Please answer all questions before submitting');
        setSubmitting(false);
        return;
      }

      // Format answers for submission
      const formattedAnswers = answers.map(answer => ({
        question: answer.question,
        selectedOption: answer.selectedOption,
        category: answer.category
      }));

      console.log('Submitting test answers:', {
        answerCount: formattedAnswers.length,
        educationLevel,
        answers: formattedAnswers
      });

      const response = await testAPI.submitTest({
        answers: formattedAnswers,
        educationLevel
      });

      console.log('Test submission response:', response);

      if (response.data && response.data.success) {
        // Store the test result ID in localStorage
        localStorage.setItem('lastTestResultId', response.data.data._id);
        // Navigate to results page with the correct path
        navigate('/test/results');
      } else {
        setError(response.data?.message || 'Failed to submit test. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting test:', error);
      setError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to submit test. Please try again.'
      );
    } finally {
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1>Psychometric Test</h1>
        <p className="text-lg text-theme-text-DEFAULT mb-8">
          No questions available at the moment. Please try again later.
        </p>
      </div>
    );
  }

  if (showEducationSelection) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-center">Select Your Education Level</h1>
        <p className="text-lg text-theme-text-DEFAULT mb-8 text-center">
          Please select your current education level to help us provide more relevant career recommendations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {educationalLevels.map((level) => (
            <div
              key={level.level}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${
                educationLevel === level.level
                  ? 'border-primary-400 bg-primary-700 ring-2 ring-primary-300'
                  : 'border-primary-700 hover:border-primary-500 hover:bg-primary-800 bg-theme-bg-light'
              }`}
              onClick={() => handleEducationLevelSelect(level.level)}
            >
              <h3 className="text-center mb-2">{level.level}</h3>
              <p className="text-theme-text-muted mb-4 text-sm">{level.description}</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {level.streams.map((stream) => (
                  <span
                    key={stream}
                    className="bg-primary-600 text-primary-100 text-xs font-medium px-2.5 py-0.5 rounded-full"
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
      <h1 className="text-center">Psychometric Test</h1>
      <p className="text-lg text-theme-text-DEFAULT mb-8 text-center">
        Answer the following questions to discover career paths that match your
        personality, interests, and skills.
      </p>

      {error && (
        <div className="mb-6 bg-error-light border-l-4 border-error-DEFAULT p-4 text-error-dark font-medium">
          <p>{error}</p>
        </div>
      )}

      <div className="mb-2">
        <div className="flex justify-between text-sm font-medium text-theme-text-DEFAULT mb-1">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-primary-800 rounded-full h-2.5 mb-6">
          <div
            className="bg-primary-500 h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-theme-bg-light shadow-xl rounded-lg border border-primary-700 p-6 sm:p-8 mb-8">
        <div className="mb-6">
          <span className="inline-block bg-primary-600 text-primary-100 text-sm font-semibold px-3 py-1 rounded-full mb-3">
            {currentQuestion.category.charAt(0).toUpperCase() + currentQuestion.category.slice(1)}
          </span>
          <h2 className="mb-6">{currentQuestion.text}</h2>
        </div>

        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className={`border-2 rounded-lg p-4 sm:p-5 cursor-pointer transition-all hover:shadow-md ${
                answers[currentQuestionIndex]?.selectedOption === index
                  ? 'border-primary-400 bg-primary-700 ring-2 ring-primary-300'
                  : 'border-primary-700 hover:border-primary-500 hover:bg-primary-800 bg-theme-bg-light'
              }`}
              onClick={() => handleOptionSelect(index)}
            >
              <div className="flex items-center">
                <div
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 ${
                    answers[currentQuestionIndex]?.selectedOption === index
                      ? 'border-primary-400 bg-primary-400'
                      : 'border-primary-500'
                  }`}
                >
                  {answers[currentQuestionIndex]?.selectedOption === index && (
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="text-base sm:text-lg text-theme-text-DEFAULT font-medium">{option.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-10">
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
            onClick={handleSubmit}
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