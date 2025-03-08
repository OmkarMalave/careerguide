import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { testAPI } from '../utils/api';

const TestResults = () => {
  const location = useLocation();
  const params = useParams();
  const [testResult, setTestResult] = useState(location.state?.testResult || null);
  const [loading, setLoading] = useState(!testResult);
  const [error, setError] = useState('');

  useEffect(() => {
    // If we don't have test results from navigation state and we have an ID in the URL,
    // fetch the specific test result
    const fetchTestResult = async () => {
      if (!testResult && params.id) {
        try {
          setLoading(true);
          const response = await testAPI.getResult(params.id);
          setTestResult(response.data.data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching test result:', err);
          setError('Failed to load test result. Please try again later.');
          setLoading(false);
        }
      }
      // If we don't have test results and no ID, fetch the latest test results
      else if (!testResult && !params.id) {
        try {
          setLoading(true);
          const response = await testAPI.getResults();
          if (response.data.data.length > 0) {
            setTestResult(response.data.data[0]);
          }
          setLoading(false);
        } catch (err) {
          console.error('Error fetching test results:', err);
          setError('Failed to load test results. Please try again later.');
          setLoading(false);
        }
      }
    };

    fetchTestResult();
  }, [testResult, params.id]);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Test Results</h1>
        <p className="mt-2 text-lg text-gray-600">
          Based on your responses, we've identified career paths that align with your
          personality, interests, and skills.
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Test completed on{' '}
          {new Date(testResult.completedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Scores Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testResult.scores && Object.entries(testResult.scores).map(([trait, score]) => (
            <div key={trait} className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-900 capitalize">
                  {trait.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <span className="text-primary-600 font-bold">{score}/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary-600 h-2.5 rounded-full"
                  style={{ width: `${(score / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Careers Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Recommended Career Paths
        </h2>
        {testResult.recommendedCareers && testResult.recommendedCareers.length > 0 ? (
          <div className="space-y-6">
            {testResult.recommendedCareers.map((career) => (
              <div
                key={career._id}
                className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {career.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{career.description}</p>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">
                        Key Skills:
                      </h4>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">
                          Education:
                        </span>{' '}
                        {career.educationRequirements}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Average Salary:
                        </span>{' '}
                        {career.averageSalary}
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium text-gray-700">
                          Job Outlook:
                        </span>{' '}
                        {career.jobOutlook}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 md:min-w-[150px]">
                    <Link
                      to={`/careers/${career._id}`}
                      className="btn btn-primary text-center"
                    >
                      View Details
                    </Link>
                    <button className="btn btn-outline text-center">
                      Select Career
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            No career recommendations available. Please try taking the test again.
          </p>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <Link to="/test" className="btn btn-primary mr-4">
          Take Test Again
        </Link>
        <Link to="/careers" className="btn btn-outline">
          Browse All Careers
        </Link>
      </div>
    </div>
  );
};

export default TestResults; 