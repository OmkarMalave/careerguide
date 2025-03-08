import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { careerAPI } from '../utils/api';

const Careers = () => {
  const [careers, setCareers] = useState([]);
  const [filteredCareers, setFilteredCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        setLoading(true);
        const response = await careerAPI.getCareers();
        setCareers(response.data.data);
        setFilteredCareers(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching careers:', err);
        setError('Failed to load careers. Please try again later.');
        setLoading(false);
      }
    };

    fetchCareers();
  }, []);

  useEffect(() => {
    // Filter careers based on search term and category
    const filtered = careers.filter((career) => {
      const matchesSearch = career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (selectedCategory === 'all') {
        return matchesSearch;
      }
      
      // This is a simplified example. In a real app, you would have proper categories
      // For now, we'll just filter based on some keywords in the description
      const categoryKeywords = {
        'technology': ['software', 'developer', 'engineer', 'tech', 'computer', 'data'],
        'healthcare': ['health', 'medical', 'doctor', 'nurse', 'patient', 'care'],
        'business': ['business', 'management', 'finance', 'marketing', 'sales'],
        'creative': ['design', 'art', 'creative', 'writer', 'artist', 'music']
      };
      
      const keywords = categoryKeywords[selectedCategory] || [];
      const matchesCategory = keywords.some(keyword => 
        career.title.toLowerCase().includes(keyword) || 
        career.description.toLowerCase().includes(keyword) ||
        career.skills.some(skill => skill.toLowerCase().includes(keyword))
      );
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredCareers(filtered);
  }, [searchTerm, selectedCategory, careers]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Explore Careers</h1>
        <p className="mt-2 text-lg text-gray-600">
          Browse through various career options and find detailed information about each one.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Careers
            </label>
            <input
              type="text"
              id="search"
              className="form-input"
              placeholder="Search by title or keyword..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Category
            </label>
            <select
              id="category"
              className="form-input"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="all">All Categories</option>
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="business">Business</option>
              <option value="creative">Creative</option>
            </select>
          </div>
        </div>
      </div>

      {/* Career List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCareers.length > 0 ? (
          filteredCareers.map((career) => (
            <div
              key={career._id}
              className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{career.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{career.description}</p>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Key Skills:</h3>
                  <div className="flex flex-wrap gap-1">
                    {career.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-primary-50 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {career.skills.length > 3 && (
                      <span className="text-xs text-gray-500">+{career.skills.length - 3} more</span>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  <p><span className="font-medium">Education:</span> {career.educationRequirements}</p>
                  <p><span className="font-medium">Avg. Salary:</span> {career.averageSalary}</p>
                </div>
                <Link
                  to={`/careers/${career._id}`}
                  className="btn btn-primary w-full text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 mb-4">No careers found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="btn btn-outline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Take Test CTA */}
      <div className="mt-12 bg-primary-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Not sure which career is right for you?
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Take our psychometric test to discover career paths that match your personality,
          interests, and skills.
        </p>
        <Link to="/test" className="btn btn-primary">
          Take the Test
        </Link>
      </div>
    </div>
  );
};

export default Careers; 