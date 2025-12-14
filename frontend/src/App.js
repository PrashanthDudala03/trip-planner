import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { FaPlane, FaHome, FaList, FaPlus, FaChartBar, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import { 
  getUserData, 
  GuestRoute, 
  ProtectedRoute, 
  AdminRoute, 
  UserOnlyRoute, 
  UserOrSuperAdminRoute 
} from './utils/RouteGuards';

import Home from './pages/Home';
import TripList from './pages/TripList';
import TripDetail from './pages/TripDetail';
import CreateTrip from './pages/CreateTrip';
import EditTrip from './pages/EditTrip';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  const { isAuthenticated, user, isAnyAdmin, isSuperAdmin } = getUserData();

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
              {!isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link to="/" className="nav-link">
                      <FaHome /> Home
                    </Link>
                  </li>
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
              ) : isAnyAdmin ? (
                <>
                  <li className="nav-item">
                    <Link to="/admin" className="nav-link">
                      <FaUserShield /> Admin Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/trips" className="nav-link">
                      <FaList /> All Trips
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button onClick={handleLogout} className="nav-link" style={{background: 'none', border: 'none', cursor: 'pointer', color: 'white'}}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </li>
                  <li className="nav-item">
                    <span className="nav-link" style={{cursor: 'default'}}>
                      {isSuperAdmin ? '👑' : '🛡️'} {user.username}
                    </span>
                  </li>
                </>
              ) : (
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
                  <li className="nav-item">
                    <span className="nav-link" style={{cursor: 'default'}}>
                      {user.username}
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            isAuthenticated ? (
              <Navigate to={isAnyAdmin ? '/admin' : '/dashboard'} replace />
            ) : (
              <Home />
            )
          } />
          
          {/* Guest Only Routes (redirect if logged in) */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* User Routes */}
          <Route path="/dashboard" element={<UserOnlyRoute><UserDashboard /></UserOnlyRoute>} />
          <Route path="/create" element={<UserOnlyRoute><CreateTrip /></UserOnlyRoute>} />

          {/* Shared Routes (Different access levels) */}
          <Route path="/trips" element={<ProtectedRoute><TripList /></ProtectedRoute>} />
          <Route path="/trips/:id" element={<ProtectedRoute><TripDetail /></ProtectedRoute>} />
          
          {/* Edit only for Users and SuperAdmins */}
          <Route path="/trips/:id/edit" element={<UserOrSuperAdminRoute><EditTrip /></UserOrSuperAdminRoute>} />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
