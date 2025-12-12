import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlane, FaCalendarCheck, FaRoute, FaCheckCircle } from 'react-icons/fa';
import { tripAPI } from '../services/api';
import { toast } from 'react-toastify';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await tripAPI.getDashboard();
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Failed to load dashboard');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your travel plans</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">
            <FaPlane />
          </div>
          <div className="stat-content">
            <h3>{stats?.total_trips || 0}</h3>
            <p>Total Trips</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">
            <FaCalendarCheck />
          </div>
          <div className="stat-content">
            <h3>{stats?.upcoming_trips || 0}</h3>
            <p>Upcoming Trips</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">
            <FaRoute />
          </div>
          <div className="stat-content">
            <h3>{stats?.ongoing_trips || 0}</h3>
            <p>Ongoing Trips</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon info">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>{stats?.completed_trips || 0}</h3>
            <p>Completed Trips</p>
          </div>
        </div>
      </div>

      <div className="card" style={{marginTop: '2rem'}}>
        <h2 style={{marginBottom: '1.5rem'}}>Recent Trips</h2>
        {stats?.recent_trips && stats.recent_trips.length > 0 ? (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {stats.recent_trips.map(trip => (
              <Link 
                key={trip.id} 
                to={`/trips/${trip.id}`}
                style={{
                  textDecoration: 'none',
                  padding: '1rem',
                  background: 'var(--light)',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
              >
                <div>
                  <h4 style={{color: 'var(--dark)', marginBottom: '0.5rem'}}>{trip.title}</h4>
                  <p style={{color: 'var(--gray)', fontSize: '0.9rem'}}>
                    {trip.destination} • {new Date(trip.start_date).toLocaleDateString()}
                  </p>
                </div>
                <span className={`status-badge status-${trip.status}`}>
                  {trip.status}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{textAlign: 'center', color: 'var(--gray)', padding: '2rem'}}>
            No trips yet. <Link to="/create">Create your first trip!</Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
