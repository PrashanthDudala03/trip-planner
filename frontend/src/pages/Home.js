import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlane, FaCalendar, FaDollarSign, FaCheckCircle } from 'react-icons/fa';

function Home() {
  const features = [
    { icon: <FaPlane />, title: 'Plan Trips', description: 'Organize your travels with ease' },
    { icon: <FaCalendar />, title: 'Create Itineraries', description: 'Schedule activities and events' },
    { icon: <FaDollarSign />, title: 'Track Expenses', description: 'Monitor your travel budget' },
    { icon: <FaCheckCircle />, title: 'Checklists', description: 'Never forget important items' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="hero">
        <h1>Plan Your Perfect Adventure</h1>
        <p>Organize trips, create itineraries, track expenses, and make unforgettable memories</p>
        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
          <Link to="/create" className="btn btn-primary">
            <FaPlane /> Start Planning
          </Link>
          <Link to="/trips" className="btn btn-secondary">
            View My Trips
          </Link>
        </div>
      </div>

      <div className="container">
        <div className="stats-grid">
          {features.map((feature, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon primary">{feature.icon}</div>
              <div className="stat-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
