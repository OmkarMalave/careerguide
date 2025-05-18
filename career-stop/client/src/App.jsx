import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PsychometricTest from './pages/PsychometricTest';
import Dashboard from './pages/Dashboard';
import Careers from './pages/Careers';
import CareerDetail from './pages/CareerDetail';
import TestResults from './pages/TestResults';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="test" element={<PsychometricTest />} />
            <Route path="test/results" element={<TestResults />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="careers" element={<Careers />} />
            <Route path="careers/:id" element={<CareerDetail />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
