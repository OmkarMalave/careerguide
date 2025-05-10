import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { testAPI } from '../utils/api';

const TestResults = () => {
  const location = useLocation();
  const [testResult, setTestResult] = useState(location.state?.testResult || null);
  const [loading, setLoading] = useState(!testResult);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      if (!testResult) {
        try {
          setLoading(true);
          const response = await testAPI.getResults();
          setTestResult(response.data.data[0]); // Get the most recent result
          setLoading(false);
        } catch (err) {
          console.error('Error fetching test results:', err);
          setError('Failed to load test results. Please try again later.');
          setLoading(false);
        }
      }
    };

    fetchResults();
  }, [testResult]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!testResult) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Test Results</h1>
        {error ? (
          <p className="text-red-600 mb-8">{error}</p>
        ) : (
          <p className="text-lg text-gray-600 mb-8">
            You haven't taken any psychometric tests yet.
          </p>
        )}
        <Link to="/test" className="btn btn-primary">
          Take the Test
        </Link>
      </div>
    );
  }

  const renderScoreBar = (score, label) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{score}/10</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-primary-600 h-2.5 rounded-full"
          style={{ width: `${(score / 10) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Test Results</h1>

      {/* Scores Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Interests */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Interests</h2>
          {renderScoreBar(testResult.scores.interests.analytical, 'Analytical')}
          {renderScoreBar(testResult.scores.interests.creative, 'Creative')}
          {renderScoreBar(testResult.scores.interests.social, 'Social')}
        </div>

        {/* Personality */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Personality</h2>
          {renderScoreBar(testResult.scores.personality.structured, 'Structured')}
          {renderScoreBar(testResult.scores.personality.independent, 'Independent')}
          {renderScoreBar(testResult.scores.personality.teamwork, 'Teamwork')}
        </div>

        {/* Skills */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
          {renderScoreBar(testResult.scores.skills.technical, 'Technical')}
          {renderScoreBar(testResult.scores.skills.communication, 'Communication')}
          {renderScoreBar(testResult.scores.skills.creative, 'Creative')}
        </div>

        {/* Values */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Values</h2>
          {renderScoreBar(testResult.scores.values.security, 'Security')}
          {renderScoreBar(testResult.scores.values.growth, 'Growth')}
          {renderScoreBar(testResult.scores.values.balance, 'Work-Life Balance')}
        </div>
      </div>

      {/* Recommended Careers */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recommended Careers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testResult.recommendedCareers.map((career) => (
            <div key={career._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{career.title}</h3>
              <p className="text-gray-600 mb-4">{career.description}</p>
              <div className="flex flex-wrap gap-2">
                {career.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-0.5 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
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