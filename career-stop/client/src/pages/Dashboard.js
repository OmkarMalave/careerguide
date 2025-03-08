import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { testAPI, careerAPI } from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState([]);
  const [selectedCareers, setSelectedCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch test results
        const testResponse = await testAPI.getResults();
        setTestResults(testResponse.data.data);
        
        // Fetch selected careers
        const careerResponse = await careerAPI.getSelectedCareers();
        setSelectedCareers(careerResponse.data.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-lg text-gray-600">
          Welcome back, {user?.name}! Here's your career journey so far.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Test Results Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Test Results</h2>
            <Link
              to="/test"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Take a new test
            </Link>
          </div>

          {testResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                You haven't taken any psychometric tests yet.
              </p>
              <Link
                to="/test"
                className="btn btn-primary inline-block"
              >
                Take the Test
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {testResults.map((result) => (
                <div
                  key={result._id}
                  className="border border-gray-200 rounded-md p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        Test taken on{' '}
                        {new Date(result.completedAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {result.recommendedCareers.length} career recommendations
                      </p>
                    </div>
                    <Link
                      to={`/test/results/${result._id}`}
                      className="text-sm text-primary-600 hover:text-primary-500"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Careers Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Selected Careers</h2>
            <Link
              to="/careers"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Explore careers
            </Link>
          </div>

          {selectedCareers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                You haven't selected any careers yet.
              </p>
              <Link
                to="/careers"
                className="btn btn-primary inline-block"
              >
                Explore Careers
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedCareers.map((career) => (
                <div
                  key={career._id}
                  className="border border-gray-200 rounded-md p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{career.title}</p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {career.description}
                      </p>
                    </div>
                    <Link
                      to={`/careers/${career._id}`}
                      className="text-sm text-primary-600 hover:text-primary-500"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/test"
            className="bg-primary-50 hover:bg-primary-100 p-4 rounded-md text-center"
          >
            <div className="text-primary-600 text-2xl mb-2">📝</div>
            <h3 className="font-medium text-gray-900">Take Psychometric Test</h3>
            <p className="text-sm text-gray-500 mt-1">
              Discover careers that match your personality
            </p>
          </Link>
          <Link
            to="/careers"
            className="bg-primary-50 hover:bg-primary-100 p-4 rounded-md text-center"
          >
            <div className="text-primary-600 text-2xl mb-2">🔍</div>
            <h3 className="font-medium text-gray-900">Browse Careers</h3>
            <p className="text-sm text-gray-500 mt-1">
              Explore different career options
            </p>
          </Link>
          <Link
            to="/test/results"
            className="bg-primary-50 hover:bg-primary-100 p-4 rounded-md text-center"
          >
            <div className="text-primary-600 text-2xl mb-2">📊</div>
            <h3 className="font-medium text-gray-900">View Test Results</h3>
            <p className="text-sm text-gray-500 mt-1">
              Review your previous test results
            </p>
          </Link>
          <div className="bg-primary-50 hover:bg-primary-100 p-4 rounded-md text-center">
            <div className="text-primary-600 text-2xl mb-2">📚</div>
            <h3 className="font-medium text-gray-900">Learning Resources</h3>
            <p className="text-sm text-gray-500 mt-1">
              Books, courses, and more for your career
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 