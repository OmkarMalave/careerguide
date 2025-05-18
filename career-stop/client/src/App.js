import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PsychometricTest from './pages/PsychometricTest';
import TestResults from './pages/TestResults';
import Careers from './pages/Careers';
import CareerDetail from './pages/CareerDetail';
import NotFound from './pages/NotFound';
import CareerRecommendationMechanism from './pages/CareerRecommendationMechanism';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="test" element={<PsychometricTest />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="test/results" element={<TestResults />} />
              <Route path="test/results/:id" element={<TestResults />} />
              <Route path="careers" element={<Careers />} />
              <Route path="careers/:id" element={<CareerDetail />} />
            </Route>
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/how-it-works" element={<CareerRecommendationMechanism />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 