import React from 'react';
import { careerCategories } from '../data/questions';
import { Link } from 'react-router-dom';

const Careers = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Explore Career Paths
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Discover various career options and find the one that matches your interests and skills.
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {careerCategories.map((career) => (
              <div key={career.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">{career.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{career.description}</p>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Key Traits</h4>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {Object.entries(career.traits).map(([category, traits]) => (
                        <div key={category} className="text-sm">
                          <span className="font-medium capitalize">{category}:</span>
                          <div className="mt-1 space-y-1">
                            {Object.entries(traits)
                              .slice(0, 2)
                              .map(([trait, value]) => (
                                <div key={trait} className="flex justify-between">
                                  <span className="capitalize">{trait}</span>
                                  <span className="text-gray-500">{Math.round(value * 100)}%</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link
                      to="/test"
                      className="font-medium text-primary-600 hover:text-primary-500"
                    >
                      Take the test to see if this career matches you
                      <span aria-hidden="true"> &rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers; 