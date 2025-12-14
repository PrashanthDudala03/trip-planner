import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPlane, FaCalendarCheck, FaRoute, FaCheckCircle, 
  FaDollarSign, FaMapMarkerAlt, FaChartPie, FaCalendar,
  FaClock, FaPlus
} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../App.css';

const API_URL = 'http://localhost:8000/api';

function UserDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/dashboard/user/`, getAuthHeaders());
      setDashboardData(response.data);
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

  const stats = dashboardData?.personal_stats || {};

  return (
    <div className="container animate-fade-in">
      <div className="page-header">
        <div>
          <h1>🎒 My Dashboard</h1>
          <p>Your travel overview and statistics</p>
        </div>
        <Link to="/create" className="btn btn-primary">
          <FaPlus /> New Trip
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">
            <FaPlane />
          </div>
          <div className="stat-content">
            <h3>{stats.total_trips || 0}</h3>
            <p>Total Trips</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">
            <FaCalendarCheck />
          </div>
          <div className="stat-content">
            <h3>{stats.upcoming_trips || 0}</h3>
            <p>Upcoming Trips</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">
            <FaRoute />
          </div>
          <div className="stat-content">
            <h3>{stats.ongoing_trips || 0}</h3>
            <p>Ongoing Trips</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon info">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>{stats.completed_trips || 0}</h3>
            <p>Completed Trips</p>
          </div>
        </div>
      </div>

      <div className="card" style={{marginBottom: '2rem'}}>
        <h3 style={{marginBottom: '1rem'}}>💰 Financial Overview</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem'}}>
          <div style={{padding: '1.5rem', background: '#fef3c7', borderRadius: '15px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem'}}>
              <FaDollarSign style={{fontSize: '1.5rem', color: '#f59e0b'}} />
              <span style={{fontSize: '0.9rem', color: '#92400e'}}>Total Budget</span>
            </div>
            <h2 style={{color: '#f59e0b', margin: 0}}>${(stats.total_budget || 0).toFixed(2)}</h2>
          </div>
          <div style={{padding: '1.5rem', background: '#fee2e2', borderRadius: '15px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem'}}>
              <FaDollarSign style={{fontSize: '1.5rem', color: '#ef4444'}} />
              <span style={{fontSize: '0.9rem', color: '#991b1b'}}>Total Expenses</span>
            </div>
            <h2 style={{color: '#ef4444', margin: 0}}>${(stats.total_expenses || 0).toFixed(2)}</h2>
          </div>
          <div style={{padding: '1.5rem', background: '#d1fae5', borderRadius: '15px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem'}}>
              <FaChartPie style={{fontSize: '1.5rem', color: '#10b981'}} />
              <span style={{fontSize: '0.9rem', color: '#065f46'}}>Remaining</span>
            </div>
            <h2 style={{color: '#10b981', margin: 0}}>
              ${((stats.total_budget || 0) - (stats.total_expenses || 0)).toFixed(2)}
            </h2>
          </div>
        </div>
      </div>

      {dashboardData?.favorite_destinations && dashboardData.favorite_destinations.length > 0 && (
        <div className="card" style={{marginBottom: '2rem'}}>
          <h3 style={{marginBottom: '1rem'}}>🌍 Favorite Destinations</h3>
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
            {dashboardData.favorite_destinations.map((dest, index) => (
              <div key={index} style={{
                padding: '1rem 1.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
              }}>
                <FaMapMarkerAlt style={{fontSize: '1.5rem'}} />
                <div>
                  <div style={{fontWeight: '700', fontSize: '1.1rem'}}>{dest.destination}</div>
                  <div style={{fontSize: '0.85rem', opacity: 0.9}}>{dest.count} trip{dest.count > 1 ? 's' : ''}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {dashboardData?.upcoming_trips && dashboardData.upcoming_trips.length > 0 && (
        <div className="card" style={{marginBottom: '2rem'}}>
          <h3 style={{marginBottom: '1rem'}}>📅 Upcoming Trips</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {dashboardData.upcoming_trips.map(trip => (
              <Link
                key={trip.id}
                to={`/trips/${trip.id}`}
                style={{
                  textDecoration: 'none',
                  padding: '1.25rem',
                  background: '#f9fafb',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s',
                  border: '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(5px)';
                  e.currentTarget.style.borderColor = '#667eea';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div>
                  <h4 style={{color: '#1f2937', marginBottom: '0.5rem'}}>{trip.title}</h4>
                  <div style={{display: 'flex', gap: '1.5rem', flexWrap: 'wrap'}}>
                    <span style={{color: '#6b7280', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <FaMapMarkerAlt /> {trip.destination}
                    </span>
                    <span style={{color: '#6b7280', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <FaCalendar /> {new Date(trip.start_date).toLocaleDateString()}
                    </span>
                    <span style={{color: '#6b7280', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <FaClock /> {trip.duration_days} days
                    </span>
                  </div>
                </div>
                <span className={`status-badge status-${trip.status}`}>
                  {trip.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
          <h3>Recent Trips</h3>
          <Link to="/trips" className="btn btn-secondary">View All</Link>
        </div>
        
        {dashboardData?.recent_trips && dashboardData.recent_trips.length > 0 ? (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {dashboardData.recent_trips.map(trip => (
              <Link
                key={trip.id}
                to={`/trips/${trip.id}`}
                style={{
                  textDecoration: 'none',
                  padding: '1rem',
                  background: '#f3f4f6',
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
                  <h4 style={{color: '#1f2937', marginBottom: '0.5rem'}}>{trip.title}</h4>
                  <p style={{color: '#6b7280', fontSize: '0.9rem'}}>
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
          <div style={{textAlign: 'center', padding: '3rem', color: '#6b7280'}}>
            <FaPlane style={{fontSize: '3rem', marginBottom: '1rem', opacity: 0.5}} />
            <p style={{fontSize: '1.1rem', marginBottom: '1rem'}}>No trips yet</p>
            <Link to="/create" className="btn btn-primary">
              Create Your First Trip
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
