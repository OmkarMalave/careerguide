# Career Stop - Backend

This is the backend API for Career Stop, a career guidance platform that helps students and professionals choose the right career path through psychometric tests and direct selection.

## Features

- User authentication with JWT
- Psychometric test system
- Career recommendations based on test results
- Direct career selection
- Recommendations for books, courses, colleges, and articles

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Psychometric Test

- `GET /api/test/questions` - Get all test questions
- `POST /api/test/submit` - Submit test answers and get results
- `GET /api/test/results` - Get user's test results
- `GET /api/test/results/:id` - Get a specific test result

### Careers

- `GET /api/careers` - Get all careers
- `GET /api/careers/:id` - Get a single career
- `POST /api/careers/:id/select` - Select a career
- `DELETE /api/careers/:id/select` - Unselect a career
- `GET /api/careers/selected` - Get user's selected careers

### Recommendations

- `GET /api/recommendations/career/:id` - Get all recommendations for a career
- `GET /api/recommendations/career/:id/books` - Get book recommendations for a career
- `GET /api/recommendations/career/:id/courses` - Get course recommendations for a career
- `GET /api/recommendations/career/:id/colleges` - Get college recommendations for a career
- `GET /api/recommendations/career/:id/articles` - Get article recommendations for a career

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/career-stop
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```
4. Seed the database with initial data:
   ```
   npm run seed
   ```
5. Start the development server:
   ```
   npm run dev
   ```

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm run seed` - Seed the database with initial data
- `npm run seed:destroy` - Remove all data from the database
