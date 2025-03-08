# Career Stop

Career Stop is a full-stack MERN (MongoDB, Express.js, React, Node.js) web application designed to help students and professionals choose the right career path through psychometric tests and direct selection.

## Features

- **Psychometric Test-Based Recommendations**:

  - Interactive psychometric test covering interests, skills, and personality traits
  - Scoring algorithm to determine suitable career paths
  - Personalized recommendations for books, courses, colleges, and articles

- **Direct Selection-Based Recommendations**:

  - Manual selection of career paths without taking the test
  - Tailored recommendations based on selected careers

- **User Authentication**:

  - Secure JWT-based authentication
  - User profiles with test results and selected careers

- **Responsive Design**:
  - Modern UI built with React and Tailwind CSS
  - Mobile-friendly interface

## Tech Stack

### Frontend

- React.js
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling
- Axios for API communication

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- RESTful API architecture

## Project Structure

```
career-stop/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   ├── src/                # Source files
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Context providers
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   └── ...
│   └── ...
├── server/                 # Backend Node.js application
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── ...
└── ...
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/career-stop.git
   cd career-stop
   ```

2. Install server dependencies:

   ```
   cd server
   npm install
   ```

3. Install client dependencies:

   ```
   cd ../client
   npm install
   ```

4. Create a `.env` file in the server directory:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/career-stop
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

5. Create a `.env` file in the client directory:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. Start the server:

   ```
   cd server
   npm run dev
   ```

2. Start the client:

   ```
   cd client
   npm start
   ```

3. Seed the database with initial data:

   ```
   cd server
   npm run seed
   ```

4. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

See the [server README](./server/README.md) for detailed API documentation.

## License

This project is licensed under the ISC License.
