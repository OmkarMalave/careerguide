import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { careerAPI, recommendationAPI } from '../utils/api';

const CareerDetail = () => {
  const { id } = useParams();
  const [career, setCareer] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSelected, setIsSelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectLoading, setSelectLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch career details
        const careerResponse = await careerAPI.getCareer(id);
        setCareer(careerResponse.data.data);
        
        // Fetch recommendations
        const recommendationsResponse = await recommendationAPI.getCareerRecommendations(id);
        setRecommendations(recommendationsResponse.data.data);
        
        // Check if career is already selected by user
        const selectedCareersResponse = await careerAPI.getSelectedCareers();
        const isAlreadySelected = selectedCareersResponse.data.data.some(
          (selectedCareer) => selectedCareer._id === id
        );
        setIsSelected(isAlreadySelected);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching career details:', err);
        setError('Failed to load career details. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSelectCareer = async () => {
    try {
      setSelectLoading(true);
      
      if (isSelected) {
        await careerAPI.unselectCareer(id);
        setIsSelected(false);
      } else {
        await careerAPI.selectCareer(id);
        setIsSelected(true);
      }
      
      setSelectLoading(false);
    } catch (err) {
      console.error('Error selecting/unselecting career:', err);
      setError('Failed to update career selection. Please try again.');
      setSelectLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Career Not Found</h1>
        {error ? (
          <p className="text-red-600 mb-8">{error}</p>
        ) : (
          <p className="text-lg text-gray-600 mb-8">
            The career you're looking for doesn't exist or has been removed.
          </p>
        )}
        <Link to="/careers" className="btn btn-primary">
          Browse Careers
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Career Header */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{career.title}</h1>
            <p className="text-lg text-gray-600 mb-4">{career.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {career.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-primary-50 text-primary-700 text-sm font-medium px-2.5 py-0.5 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Education Requirements:</span>{' '}
                {career.educationRequirements}
              </div>
              <div>
                <span className="font-medium text-gray-700">Average Salary:</span>{' '}
                {career.averageSalary}
              </div>
              <div className="md:col-span-2">
                <span className="font-medium text-gray-700">Job Outlook:</span>{' '}
                {career.jobOutlook}
              </div>
            </div>
          </div>
          <div className="md:min-w-[200px]">
            <button
              onClick={handleSelectCareer}
              disabled={selectLoading}
              className={`w-full mb-4 btn ${
                isSelected ? 'btn-outline' : 'btn-primary'
              } disabled:opacity-50`}
            >
              {selectLoading
                ? 'Processing...'
                : isSelected
                ? 'Remove from Selected'
                : 'Add to Selected Careers'}
            </button>
            <Link to="/test" className="w-full btn btn-outline block text-center">
              Take Psychometric Test
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('books')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'books'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Books
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'courses'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => setActiveTab('colleges')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'colleges'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Colleges
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'articles'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Articles
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow rounded-lg p-6">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Career Overview</h2>
            <p className="text-gray-600 mb-6">{career.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Key Skills</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  {career.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Education Path</h3>
                <p className="text-gray-600 mb-4">{career.educationRequirements}</p>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Job Outlook</h3>
                <p className="text-gray-600">{career.jobOutlook}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'books' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Books</h2>
            {recommendations?.books && recommendations.books.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.books.map((book, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-1">{book.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">by {book.author}</p>
                    <p className="text-gray-600 mb-4">{book.description}</p>
                    <a
                      href={book.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Learn More
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No book recommendations available for this career.</p>
            )}
          </div>
        )}

        {activeTab === 'courses' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Courses</h2>
            {recommendations?.courses && recommendations.courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.courses.map((course, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900">{course.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${course.isOnline ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {course.isOnline ? 'Online' : 'In-person'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">Provider: {course.provider}</p>
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    <a
                      href={course.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View Course
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No course recommendations available for this career.</p>
            )}
          </div>
        )}

        {activeTab === 'colleges' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Colleges</h2>
            {recommendations?.colleges && recommendations.colleges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.colleges.map((college, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-1">{college.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">Location: {college.location}</p>
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Programs:</h4>
                      <div className="flex flex-wrap gap-1">
                        {college.programs.map((program, idx) => (
                          <span
                            key={idx}
                            className="bg-primary-50 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full"
                          >
                            {program}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{college.description}</p>
                    <a
                      href={college.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Visit Website
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No college recommendations available for this career.</p>
            )}
          </div>
        )}

        {activeTab === 'articles' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Articles</h2>
            {recommendations?.articles && recommendations.articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.articles.map((article, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-1">{article.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      by {article.author} • {new Date(article.publishedDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 mb-4">{article.description}</p>
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Read Article
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No article recommendations available for this career.</p>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <Link to="/careers" className="btn btn-outline">
          Back to Careers
        </Link>
        <Link to="/dashboard" className="btn btn-primary">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default CareerDetail; 