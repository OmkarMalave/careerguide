import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Career Stop</h3>
            <p className="text-gray-300">
              Helping students and professionals choose the right career path through
              psychometric tests and personalized recommendations.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/test" className="text-gray-300 hover:text-white">
                  Psychometric Test
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-300 hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p className="text-gray-300 mb-2">
              Have questions or feedback? Reach out to us.
            </p>
            <a
              href="mailto:info@careerstop.com"
              className="text-primary-400 hover:text-primary-300"
            >
              info@careerstop.com
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Career Stop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 