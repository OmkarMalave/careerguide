# Career Stop - Frontend

This is the frontend for Career Stop, a career guidance platform that helps students and professionals choose the right career path through psychometric tests and direct selection.

## Features

- User authentication
- Psychometric test system
- Career exploration and selection
- Personalized recommendations for books, courses, colleges, and articles
- Responsive design for all devices

## Tech Stack

- React.js
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling
- Axios for API communication

## Pages

- **Home**: Landing page with information about the platform
- **Login/Register**: User authentication pages
- **Dashboard**: User's personalized dashboard with test results and selected careers
- **Psychometric Test**: Interactive test to determine career recommendations
- **Test Results**: Display of test results and career recommendations
- **Careers**: Browse and search for careers
- **Career Detail**: Detailed information about a specific career with recommendations

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```
   npm start
   ```

## Available Scripts

- `npm start` - Start the development server
- `npm build` - Build the app for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Connecting to Backend

The frontend is configured to connect to the backend API at `http://localhost:5000/api` by default. You can change this by modifying the `REACT_APP_API_URL` environment variable.
