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
          responses across five key dimensions:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">1. Personality Assessment</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Openness to experience</li>
              <li>Conscientiousness</li>
              <li>Extraversion</li>
              <li>Emotional stability</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">2. Interest Profiling</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Realistic (practical, physical)</li>
              <li>Investigative (analytical, intellectual)</li>
              <li>Artistic (creative, original)</li>
              <li>Social (helping, teaching)</li>
              <li>Enterprising (leading, persuading)</li>
              <li>Conventional (organizing, clerical)</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">3. Skills Evaluation</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Technical abilities</li>
              <li>Communication skills</li>
              <li>Analytical thinking</li>
              <li>Creative problem-solving</li>
              <li>Organizational skills</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">4. Values & Preferences</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Impact and contribution</li>
              <li>Job security and stability</li>
              <li>Income and financial goals</li>
              <li>Work autonomy</li>
              <li>Recognition and growth</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4 md:col-span-2">
            <h3 className="font-semibold text-lg mb-2">5. Work Style Assessment</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Team collaboration vs. independent work</li>
              <li>Structured vs. flexible environments</li>
              <li>Fast-paced vs. steady-paced work</li>
              <li>Pressure handling and stress management</li>
              <li>Project duration preferences</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Scoring System */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Scoring System</h2>
        <p className="text-gray-600 mb-4">
          Each dimension is scored on a scale of 0-1, where:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">0.0 - 0.3: Low Alignment</h3>
            <p className="text-gray-600">Indicates areas that may not align with your natural inclinations</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">0.4 - 0.6: Moderate Alignment</h3>
            <p className="text-gray-600">Shows areas where you have some interest or capability</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">0.7 - 1.0: High Alignment</h3>
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
              <p className="text-gray-600">Your test responses are analyzed to create a comprehensive profile of your interests, personality, skills, and values. This includes both primary traits and subcategories for more detailed matching.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-bold">2</span>
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-lg">Career Database Matching</h3>
              <p className="text-gray-600">Your profile is compared against our extensive database of careers, each with detailed trait requirements, growth prospects, salary ranges, and required certifications.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-bold">3</span>
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-lg">Score Calculation</h3>
              <p className="text-gray-600">A weighted scoring system calculates the compatibility between your profile and each career option. The weights are distributed as follows:</p>
              <ul className="list-disc list-inside text-gray-600 mt-2">
                <li>Personality: 25%</li>
                <li>Interests: 30%</li>
                <li>Skills: 25%</li>
                <li>Values: 15%</li>
                <li>Work Style: 5%</li>
              </ul>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-bold">4</span>
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-lg">Recommendation Generation</h3>
              <p className="text-gray-600">The system generates personalized career recommendations based on your match scores, including:</p>
              <ul className="list-disc list-inside text-gray-600 mt-2">
                <li>Top matching careers with detailed compatibility scores</li>
                <li>Your key strengths and areas for improvement</li>
                <li>Required education and certifications</li>
                <li>Career growth prospects and salary ranges</li>
                <li>Recommended learning resources and next steps</li>
              </ul>
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