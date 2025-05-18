import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-theme-bg-light shadow-md w-full">
      <div className="max-w-[1920px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between h-20">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary-300">
                CareerCompass
              </Link>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link
                to="/"
                className="border-transparent text-theme-text-DEFAULT hover:border-primary-400 hover:text-primary-300 inline-flex items-center px-3 pt-1 border-b-2 text-base font-medium"
              >
                Home
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/test"
                    className="border-transparent text-theme-text-DEFAULT hover:border-primary-400 hover:text-primary-300 inline-flex items-center px-3 pt-1 border-b-2 text-base font-medium"
                  >
                    Psychometric Test
                  </Link>
                  <Link
                    to="/careers"
                    className="border-transparent text-theme-text-DEFAULT hover:border-primary-400 hover:text-primary-300 inline-flex items-center px-3 pt-1 border-b-2 text-base font-medium"
                  >
                    Careers
                  </Link>
                  <Link
                    to="/dashboard"
                    className="border-transparent text-theme-text-DEFAULT hover:border-primary-400 hover:text-primary-300 inline-flex items-center px-3 pt-1 border-b-2 text-base font-medium"
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-6">
                <span className="text-base font-medium text-theme-text-DEFAULT">
                  Hello, {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline text-base px-6"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-6">
                <Link to="/login" className="btn btn-outline text-base px-6">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary text-base px-6">
                  Register
                </Link>
              </div>
            )}
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-primary-300 hover:text-primary-200 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-theme-bg-light border-t border-primary-700">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-theme-text-DEFAULT hover:bg-primary-700 hover:border-primary-400 hover:text-primary-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/test"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-theme-text-DEFAULT hover:bg-primary-700 hover:border-primary-400 hover:text-primary-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Psychometric Test
                </Link>
                <Link
                  to="/careers"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-theme-text-DEFAULT hover:bg-primary-700 hover:border-primary-400 hover:text-primary-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Careers
                </Link>
                <Link
                  to="/dashboard"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-theme-text-DEFAULT hover:bg-primary-700 hover:border-primary-400 hover:text-primary-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 