import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { testAPI } from '../utils/api';
import { careerCategories } from '../data/questions';

const TestResults = () => {
  const location = useLocation();
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        // First try to get the last test result ID from localStorage
        const lastTestResultId = localStorage.getItem('lastTestResultId');
        
        if (lastTestResultId) {
          // If we have a last test result ID, fetch that specific result
          const response = await testAPI.getResult(lastTestResultId);
          if (response.data && response.data.success) {
            setTestResult(response.data.data);
          }
        } else {
          // Otherwise, fetch the most recent result
          const response = await testAPI.getResults();
          if (response.data && response.data.success && response.data.data.length > 0) {
            setTestResult(response.data.data[0]);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching test results:', err);
        setError('Failed to load test results. Please try again later.');
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  console.log('Rendering TestResults component...');
  console.log('Initial location.state?.testResult:', location.state?.testResult);
  console.log('Current testResult state before return:', testResult);
  console.log('Current loading state:', loading);
  console.log('Current error state:', error);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-theme-bg-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-error-light border-l-4 border-error-DEFAULT p-4 text-error-dark">
          <p>{error}</p>
        </div>
        <div className="mt-6 text-center">
          <Link to="/test" className="btn btn-primary">
            Take Test Again
          </Link>
        </div>
      </div>
    );
  }

  if (!testResult) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-center mb-8">Test Results</h1>
        <div className="text-center">
          <p className="mb-6">No test results found.</p>
          <Link to="/test" className="btn btn-primary">
            Take Test
          </Link>
        </div>
      </div>
    );
  }

  console.log('Condition (!testResult || !testResult.scores) is FALSE, proceeding to render results.');
  const maxPossibleScore = testResult.scores.numberOfQuestionsAnswered 
    ? testResult.scores.numberOfQuestionsAnswered * 5 
    : 20 * 5;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-theme-bg-dark text-theme-text-DEFAULT">
      <h1 className="text-3xl font-bold text-theme-text-DEFAULT mb-8 text-center">Your Career Recommendations</h1>

      <div className="bg-theme-bg-light rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-theme-text-DEFAULT mb-6">Based on Your Test Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testResult.recommendedCareers.map((career) => {
            const fullCareer = careerCategories.find(c => c.id === career._id);
            return (
              <div key={career._id} className="bg-theme-bg-lighter border border-theme-border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-theme-text-DEFAULT mb-2">{career.title}</h3>
                <p className="text-theme-text-light mb-4 text-sm">{career.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {career.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-primary-700 text-primary-100 text-xs font-medium px-2.5 py-0.5 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                {fullCareer?.education?.degrees && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-theme-text-DEFAULT mb-2">Education Requirements:</h4>
                    <ul className="text-sm text-theme-text-light list-disc list-inside">
                      {fullCareer.education.degrees.slice(0, 2).map((degree, index) => (
                        <li key={index}>{degree}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Match Score: {career.matchScore}%</h4>
                  <ul className="text-sm text-theme-text-light list-disc list-inside">
                    {career.matchReasons?.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>
                <Link to={`/careers/${career._id}`} className="inline-block mt-4 text-sm text-primary-400 hover:text-primary-300">
                  Learn More &rarr;
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex justify-center space-x-4">
        <Link to="/test" className="btn btn-outline">
          Retake Test
        </Link>
        <Link to="/careers" className="btn btn-primary">
          Explore More Careers
        </Link>
      </div>
    </div>
  );
};

export default TestResults; 