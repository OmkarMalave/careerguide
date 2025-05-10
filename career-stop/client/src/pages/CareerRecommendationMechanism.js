import React from 'react';
import { Link } from 'react-router-dom';

const CareerRecommendationMechanism = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">How We Recommend Careers</h1>

      {/* Overview Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Our Approach</h2>
        <p className="text-gray-600 mb-4">
          Our career recommendation system uses a comprehensive psychometric assessment that evaluates your interests, 
          personality traits, skills, and values to suggest the most suitable career paths. The system analyzes your 
          responses across four key dimensions:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">1. Interests Assessment</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Analytical thinking and problem-solving</li>
              <li>Creative expression and innovation</li>
              <li>Social interaction and helping others</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">2. Personality Traits</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Structured vs. flexible work style</li>
              <li>Independent vs. team-oriented</li>
              <li>Leadership and collaboration</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">3. Skills Evaluation</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Technical abilities</li>
              <li>Communication skills</li>
              <li>Creative problem-solving</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">4. Values & Preferences</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Job security and stability</li>
              <li>Career growth opportunities</li>
              <li>Work-life balance</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Scoring System */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Scoring System</h2>
        <p className="text-gray-600 mb-4">
          Each dimension is scored on a scale of 1-10, where:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">1-3: Low Preference</h3>
            <p className="text-gray-600">Indicates areas that may not align with your natural inclinations</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">4-7: Moderate Preference</h3>
            <p className="text-gray-600">Shows areas where you have some interest or capability</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">8-10: High Preference</h3>
            <p className="text-gray-600">Indicates strong alignment with your interests and abilities</p>
          </div>
        </div>
      </div>

      {/* Career Matching Process */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Career Matching Process</h2>
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-bold">1</span>
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-lg">Profile Analysis</h3>
              <p className="text-gray-600">Your test responses are analyzed to create a comprehensive profile of your interests, personality, skills, and values.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-bold">2</span>
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-lg">Career Database Matching</h3>
              <p className="text-gray-600">Your profile is compared against our extensive database of careers, each with detailed trait requirements and characteristics.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-bold">3</span>
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-lg">Score Calculation</h3>
              <p className="text-gray-600">A weighted scoring system calculates the compatibility between your profile and each career option.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-bold">4</span>
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-lg">Recommendation Generation</h3>
              <p className="text-gray-600">The top 5 most compatible careers are selected and presented with detailed information about requirements, opportunities, and growth potential.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-8">
        <Link to="/test" className="btn btn-primary mr-4">
          Take the Test
        </Link>
        <Link to="/careers" className="btn btn-outline">
          Explore All Careers
        </Link>
      </div>
    </div>
  );
};

export default CareerRecommendationMechanism; 