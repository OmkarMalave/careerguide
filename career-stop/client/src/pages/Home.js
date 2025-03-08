import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              Find Your Perfect Career Path
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Discover the right career for you through our personalized psychometric tests
              or explore career options directly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/test"
                    className="btn bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg"
                  >
                    Take the Test
                  </Link>
                  <Link
                    to="/careers"
                    className="btn bg-secondary-700 text-white hover:bg-secondary-800 font-bold py-3 px-6 rounded-lg"
                  >
                    Explore Careers
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="btn bg-secondary-700 text-white hover:bg-secondary-800 font-bold py-3 px-6 rounded-lg"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How Career Stop Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="text-primary-600 text-4xl mb-4 text-center">1</div>
              <h3 className="text-xl font-bold mb-2 text-center">Take the Psychometric Test</h3>
              <p className="text-gray-600 text-center">
                Answer questions about your interests, skills, and personality traits to
                help us understand what careers might be a good fit for you.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="text-primary-600 text-4xl mb-4 text-center">2</div>
              <h3 className="text-xl font-bold mb-2 text-center">Get Personalized Recommendations</h3>
              <p className="text-gray-600 text-center">
                Based on your test results, we'll recommend career paths that align with
                your unique profile and preferences.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="text-primary-600 text-4xl mb-4 text-center">3</div>
              <h3 className="text-xl font-bold mb-2 text-center">Explore Resources</h3>
              <p className="text-gray-600 text-center">
                Discover books, courses, colleges, and articles tailored to help you
                succeed in your chosen career path.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4 justify-center">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl">
                  S
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Sarah Johnson</h4>
                  <p className="text-gray-600">College Student</p>
                </div>
              </div>
              <p className="text-gray-600 text-center">
                "Career Stop helped me discover career paths I hadn't even considered.
                The psychometric test was insightful, and the resources provided were
                incredibly helpful for my college planning."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4 justify-center">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl">
                  M
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Michael Chen</h4>
                  <p className="text-gray-600">Career Changer</p>
                </div>
              </div>
              <p className="text-gray-600 text-center">
                "After 10 years in finance, I was looking for a change. The test results
                confirmed my interest in tech, and the recommended courses helped me
                transition into a new field successfully."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4 justify-center">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl">
                  J
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Jessica Martinez</h4>
                  <p className="text-gray-600">High School Teacher</p>
                </div>
              </div>
              <p className="text-gray-600 text-center">
                "I recommend Career Stop to all my students. It's an invaluable tool for
                helping them explore their interests and make informed decisions about
                their future education and careers."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Path?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of students and professionals who have discovered their ideal
            career path with Career Stop.
          </p>
          {isAuthenticated ? (
            <Link
              to="/test"
              className="btn bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg inline-block"
            >
              Take the Test Now
            </Link>
          ) : (
            <Link
              to="/register"
              className="btn bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg inline-block"
            >
              Get Started for Free
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home; 