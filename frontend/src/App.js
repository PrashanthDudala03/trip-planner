import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FaPlane, FaHome, FaList, FaPlus, FaChartBar } from 'react-icons/fa';
import Home from './pages/Home';
import TripList from './pages/TripList';
import TripDetail from './pages/TripDetail';
import CreateTrip from './pages/CreateTrip';
import EditTrip from './pages/EditTrip';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
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
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trips" element={<TripList />} />
          <Route path="/trips/:id" element={<TripDetail />} />
          <Route path="/trips/:id/edit" element={<EditTrip />} />
          <Route path="/create" element={<CreateTrip />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
