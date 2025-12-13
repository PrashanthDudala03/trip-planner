import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { FaPlane, FaHome, FaList, FaPlus, FaChartBar, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import Home from './pages/Home';
import TripList from './pages/TripList';
import TripDetail from './pages/TripDetail';
import CreateTrip from './pages/CreateTrip';
import EditTrip from './pages/EditTrip';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAuthenticated = !!localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              <FaPlane className="logo-icon" />
              <span>Trip Planner</span>
            </Link>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  <FaHome /> Home
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link to="/dashboard" className="nav-link">
                      <FaChartBar /> Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/trips" className="nav-link">
                      <FaList /> My Trips
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/create" className="nav-link nav-link-btn">
                      <FaPlus /> New Trip
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button onClick={handleLogout} className="nav-link" style={{background: 'none', border: 'none', cursor: 'pointer', color: 'white'}}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </li>
                  {user && (
                    <li className="nav-item">
                      <span className="nav-link" style={{cursor: 'default'}}>
                        {user.username}
                      </span>
                    </li>
                  )}
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">
                      <FaSignInAlt /> Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/signup" className="nav-link nav-link-btn">
                      <FaUserPlus /> Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/trips" element={<ProtectedRoute><TripList /></ProtectedRoute>} />
          <Route path="/trips/:id" element={<ProtectedRoute><TripDetail /></ProtectedRoute>} />
          <Route path="/trips/:id/edit" element={<ProtectedRoute><EditTrip /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
