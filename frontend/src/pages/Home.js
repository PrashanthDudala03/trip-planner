import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlane, FaCalendar, FaDollarSign, FaCheckCircle } from 'react-icons/fa';

function Home() {
  const navigate = useNavigate();

  const features = [
    { 
      icon: <FaPlane />, 
      title: 'Plan Trips', 
      description: 'Organize your travels with ease',
      action: () => navigate('/trips')
    },
    { 
      icon: <FaCalendar />, 
      title: 'Create Itineraries', 
      description: 'Schedule activities and events',
      action: () => navigate('/create')
    },
    { 
      icon: <FaDollarSign />, 
      title: 'Track Expenses', 
      description: 'Monitor your travel budget',
      action: () => navigate('/trips')
    },
    { 
      icon: <FaCheckCircle />, 
      title: 'Checklists', 
      description: 'Never forget important items',
      action: () => navigate('/trips')
    },
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
            <div 
              key={index} 
              className="stat-card" 
              onClick={feature.action}
              style={{cursor: 'pointer', transition: 'all 0.3s'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
              }}
            >
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
