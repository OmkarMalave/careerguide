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
  const [webResults, setWebResults] = useState([]);
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        setLoading(true);
        const response = await careerAPI.getCareers();
        // Ensure no duplicates by using a Map with _id as key
        const uniqueCareers = Array.from(
          new Map(response.data.data.map(career => [career._id, career])).values()
        );
        setCareers(uniqueCareers);
        setFilteredCareers(uniqueCareers);
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
        (career.traits?.skills && Object.keys(career.traits.skills).some(skill => 
          skill.toLowerCase().includes(keyword)
        ))
      );
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredCareers(filtered);

    // If no results found in database and search term exists, search the web
    if (filtered.length === 0 && searchTerm.trim() !== '') {
      searchWeb();
    } else {
      setWebResults([]);
    }
  }, [searchTerm, selectedCategory, careers]);

  const searchWeb = async () => {
    try {
      setIsSearchingWeb(true);
      const response = await careerAPI.searchWebCareers(searchTerm);
      setWebResults(response.data.results || []);
    } catch (err) {
      console.error('Error searching web:', err);
    } finally {
      setIsSearchingWeb(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1>Explore Careers</h1>
        <p className="mt-2 text-lg text-theme-text-DEFAULT">
          Browse through various career options and find detailed information about each one.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-error-light border-l-4 border-error-DEFAULT p-4 text-error-dark font-medium">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-theme-bg-light shadow rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="form-label">
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
            <label htmlFor="category" className="form-label">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCareers.length > 0 ? (
          filteredCareers.map((career) => (
            <div
              key={career._id}
              className="bg-theme-bg-light shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-theme-border-DEFAULT"
            >
              <div className="p-6">
                <h2>{career.title}</h2>
                <p className="text-theme-text-DEFAULT mb-4 line-clamp-3">{career.description}</p>
                <div className="mb-4">
                  <h3 className="text-sm mb-1">Key Skills:</h3>
                  <div className="flex flex-wrap gap-1">
                    {career.traits?.skills && Object.entries(career.traits.skills)
                      .slice(0, 3)
                      .map(([skill, value]) => (
                        <span
                          key={skill}
                          className="bg-primary-600 text-primary-100 text-xs font-medium px-2 py-0.5 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    {career.traits?.skills && Object.keys(career.traits.skills).length > 3 && (
                      <span className="text-xs text-theme-text-muted">
                        +{Object.keys(career.traits.skills).length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-sm text-theme-text-DEFAULT mb-4">
                  {career.education?.degrees && (
                    <p>
                      <span className="font-semibold text-theme-text-light">Education:</span>{' '}
                      {career.education.degrees[0]}
                    </p>
                  )}
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
          <div className="col-span-full">
            {isSearchingWeb ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <p className="text-theme-text-DEFAULT">Searching the web for career information...</p>
              </div>
            ) : webResults.length > 0 ? (
              <div>
                <h2 className="mb-4">Web Search Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {webResults.map((result, index) => (
                    <div key={index} className="bg-theme-bg-light shadow rounded-lg p-6 border border-theme-border-DEFAULT">
                      <h3>{result.title}</h3>
                      <p className="text-theme-text-DEFAULT mb-4">{result.description}</p>
                      <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-400 hover:text-primary-300 font-medium"
                      >
                        Learn More
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-theme-text-DEFAULT mb-4">No careers found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setWebResults([]);
                  }}
                  className="btn btn-outline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
        <h2 className="mb-4">
          Not sure which career is right for you?
        </h2>
        <p className="text-lg text-theme-text-DEFAULT mb-6">
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